const fs = require("fs");
const awaitable = require("@scriptabuild/awaitable");

function load(filename) {
	return {
		json: async() => {
			try {
				let rawdata = await awaitable(cb => fs.readFile(filename, cb));
				let data = JSON.parse(rawdata);
				return data;
			} catch (err) {
				return undefined;
			}
		}
		// text
		// stream buffer
	};
}

// function folder(folder) {
// 	// write to next file in folder
// 	// append to last file in folder
// 	// read last file in folder
// 	// create next folder

// 	return {
// 	}
// }

function save(filename) {
	return {
		json: async(data) => {
			try {
				let jsondata = JSON.stringify(data);
				await awaitable(cb => fs.writeFile(filename, jsondata, {mode: "w"}, cb));
			} catch (err) {
				return undefined;
			}
		}
		// text
		// stream buffer
	};
}

module.exports = {
	load,
	save
};