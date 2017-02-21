const fs = require("fs");
const path = require("path");

export default function Store(storePath) {

	let state = undefined;
	let eventhandlers = {};
	let currentLogNo = undefined;

	this.setInitialState = initialState => {
		state = initialState
	};

	this.registerEventhandler = (eventname, eventhandler) => {
		// Signature for a commandhandler is:
		//  (previousState, command) => newState
		eventhandlers[eventname] = eventhandler;
	}

	this.restore = () => {

		// determine files...

		let files = fs.readdirSync(storePath);
		let latestSnapshotNo = getLatestFileNo(files, ".snapshot");
		let latestLogNo = getLatestFileNo(files, ".log");
		currentLogNo = 1 + latestLogNo;

		// read files...

		if (latestSnapshotNo) {
			let snapshotfile = path.resolve(storePath, latestSnapshotNo + ".snapshot");
			console.log("Reading snapshot file:", snapshotfile)
			state = JSON.parse(fs.readFileSync(snapshotfile).toString());
		}

		for (let logNo = latestSnapshotNo + 1; logNo < currentLogNo; logNo++) {
			let logfile = path.resolve(storePath, logNo + ".log");
			console.log("Reading log file:", logfile);

			let commands = fs.readFileSync(logfile).toString().split("\n")
				.filter(line => line)
				.map(line => JSON.parse(line));
			state = commands.reduce((accumulatedState, command) => handleCommand(accumulatedState, command), state);
		}
	}

	function getLatestFileNo(files, ext) {
		return files
			.map(files => path.parse(files))
			.filter(fi => fi.ext == ext && !isNaN(fi.name))
			.map(fi => parseInt(fi.name))
			.reduce((max, num) => num > max ? num : max, 0);
	}

	this.dispatch = command => {
		if (!currentLogNo) {
			throw new Error("Cannot dispath before state is restored!")
		};

		let logfile = path.resolve(storePath, currentLogNo + ".log");
		fs.appendFileSync(logfile, JSON.stringify(command) + "\n", {
			flag: "a"
		});

		state = handleCommand(state, command);
	}

	function handleCommand(previousState, command) {
		let eventhandler = eventhandlers[command.type];
		if (eventhandler === undefined) {
			throw new Error("Cannot handle command. No eventhandler registered for " + command.type);
		}

		return eventhandler(previousState, command);
	}

	this.snapshot = () => {
		if (!currentLogNo) {
			throw new Error("Cannot take snapshot before state is restored!")
		};

		let snapshotfile = path.resolve(storePath, currentLogNo + ".snapshot");
		fs.appendFileSync(snapshotfile, JSON.stringify(state), {
			flag: "w"
		});

		currentLogNo++;
	}

	this.getState = () => {
		if (!currentLogNo) {
			throw new Error("Cannot get state before state is restored!")
		};

		return state;
	}
}