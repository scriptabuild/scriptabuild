const fs = require("fs");
const path = require("path");

export default function Store(storePath) {

	let state = undefined;
	let eventhandlers = [];
	let currentLogNo = undefined;

	this.registerEventhandler = reducer => {
		// Signature for a reducer is:
		//  (previousState, action) => newState
		eventhandlers.push(reducer);
	}

	this.restore = () => {
		if(eventhandlers.length == 0){
			throw new Error("Cannot restore before registering the eventhandlers!")
		};

		// determine files...

		let files = fs.readdirSync(storePath);

		let latestSnapshotNo = files
			.map(files => path.parse(files))
			.filter(fi => fi.ext == ".snapshot" && !isNaN(fi.name))
			.map(fi => parseInt(fi.name))
			.reduce((max, num) => num > max ? num : max, 0);

		let latestLogNo = files
			.map(files => path.parse(files))
			.filter(fi => fi.ext == ".log" && !isNaN(fi.name))
			.map(fi => parseInt(fi.name))
			.reduce((max, num) => num > max ? num : max, 0);

		currentLogNo = 1 + latestLogNo;

		// read files...

		if (latestSnapshotNo) {
			let snapshotfile = path.resolve(storePath, latestSnapshotNo + ".snapshot");
			console.log("Reading snapshot file:", snapshotfile)
			state = JSON.parse(fs.readFileSync(snapshotfile).toString());
		}

		for(let logNo = latestSnapshotNo+1; logNo < currentLogNo; logNo++)
		{
			let logfile = path.resolve(storePath, logNo + ".log");
			console.log("Reading log file:", logfile);

			let actions = fs.readFileSync(logfile).toString().split("\n")
				.filter(line => line)
				.map(line => JSON.parse(line));
			state = actions.reduce((acc, action) => playAction(acc, action), state);
		}
	}

	this.dispatch = action => {
		if(!currentLogNo){
			throw new Error("Cannot dispath before state is restored!")
		};

		let logfile = path.resolve(storePath, currentLogNo + ".log");
		fs.appendFileSync(logfile, JSON.stringify(action) + "\n", {
			flag: "a"
		});

		state = playAction(state, action);
	}

	function playAction(state, action) {
		return eventhandlers.reduce((acc, transform) => transform(acc, action), state);
	}

	this.snapshot = () => {
		if(!currentLogNo){
			throw new Error("Cannot snapshot before state is restored!")
		};

		let snapshotfile = path.resolve(storePath, currentLogNo + ".snapshot");
		fs.appendFileSync(snapshotfile, JSON.stringify(state), {
			flag: "w"
		});

		currentLogNo++;
	}

	this.getState = () => {
		if(!currentLogNo){
			throw new Error("Cannot get state before state is restored!")
		};

		return state;
	}
}