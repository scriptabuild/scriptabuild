const fs = require("fs");
const path = require("path");

// external surface of Store

const initStore = (folder, createInstance) => {
	let underlyingStore = new UnderlyingStore(folder, createInstance);
	return underlyingStore;
};

module.exports = initStore;

function getLatestFileNo(files, ext) {
	return files
		.map(files => path.parse(files))
		.filter(fi => fi.ext == ext && !isNaN(fi.name))
		.map(fi => parseInt(fi.name))
		.reduce((max, num) => num > max ? num : max, 0);
}

function camelToPascalCase(camelcaseString) {
	return camelcaseString[0].toUpperCase() + camelcaseString.substring(1);
}


function UnderlyingStore(folder, createInstance) {

	let instance = undefined;

	let eventhandlers = undefined;
	let snapshothandlers = undefined;

	let latestLogOrSnapshotNo = undefined;
	let eventlog = [];

	restore();

	//

	function registerEventhandlers(newEventhandlers){
		eventhandlers = newEventhandlers
	};

	function registerSnapshothandlers(newSnapshothandlers){
		snapshothandlers = newSnapshothandlers
	};

	function restore() {
		if(!instance) instance = createInstance(dispatch, registerEventhandlers, registerSnapshothandlers);

		// determine files...

		let files = fs.readdirSync(folder);
		let latestSnapshotNo = getLatestFileNo(files, ".snapshot");
		let latestLogNo = getLatestFileNo(files, ".log");
		latestLogOrSnapshotNo = Math.max(latestSnapshotNo, latestLogNo)

		// read files...

		if (snapshothandlers, latestSnapshotNo) {
			let snapshotfile = path.resolve(folder, latestSnapshotNo + ".snapshot");
			console.log("Reading snapshot file:", snapshotfile)
			let snapshotContents = JSON.parse(fs.readFileSync(snapshotfile).toString());
			snapshothandlers.restoreFromSnapshot(snapshotContents);
		}

		for (let logNo = latestSnapshotNo + 1; logNo <= latestLogNo; logNo++) {
			let logfile = path.resolve(folder, logNo + ".log");
			console.log("Reading log file:", logfile);

			let events = JSON.parse(fs.readFileSync(logfile).toString());

			events.forEach(eventEntry => {
				handleEvent(eventEntry.eventname, eventEntry.event);
			});
		}
	}


	function handleEvent(eventname, event) {
		let eventhandlername = "on" + camelToPascalCase(eventname);
		let eventhandler = eventhandlers[eventhandlername];
		if (eventhandler === undefined) {
			throw new Error(`Cannot handle event. Can't find "${eventhandlername}" eventhandler.`);
		}

		return eventhandler(event);
	}

	function dispatch(eventname, event){
		eventlog.push({
			eventname,
			event
		});
		handleEvent(eventname, event);
	}

	function save() {
		if (eventlog && eventlog.length) {
			let logfile = path.resolve(folder, ++latestLogOrSnapshotNo + ".log");
			fs.appendFileSync(logfile, JSON.stringify(eventlog), {
				flag: "wx"
			});

			eventlog = [];
		}
	}

	this.snapshot = () => {
		if(!instance) restore();

		let state = snapshothandlers.createSnapshotData();

		let snapshotfile = path.resolve(folder, latestLogOrSnapshotNo + ".snapshot");
		fs.appendFileSync(snapshotfile, JSON.stringify(state), {
			flag: "w"
		});
	}

	this.withRetries = (action, maxRetries = 5) => {
		let retryCount = 0;
		let isCancelled = false;

		while (retryCount < maxRetries) {
			if(!instance) restore();

			action(instance, () => { isCancelled = true; });
			try {
				if (isCancelled) {
					instance = undefined;
					return;
				} else {
					save();
				}
				return this;
			} catch (err) {
				console.log("ERROR:", err);
				retryCount++;
			}
			// TODO: incremental delay?
		}
		throw new Error("Failed the max number of retries. Aborting and rolling back action.");
	}	
}