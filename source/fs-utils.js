const fs = require("fs");
const awaitable = require("@scriptabuild/awaitable");

function load(filename) {
    return {
        async json() {
            try {
                let rawdata = await awaitable(cb => fs.readFile(filename, cb));
                let data = JSON.parse(rawdata);
                return data;
            }
            catch (err) {
                return undefined;
            }
        }
        // text
        // stream buffer
    };
}

function folder(path) {
    // write to next file in folder
    // append to last file in folder
    // read last file in folder
    // create next folder

    return {
        async ensure() {
            if (/^win/.test(process.platform)) {
                try {
                    await awaitable(cb => fs.mkdir(path, 0o777, cb));
                    return;
                }
                catch (err) {
                    throw new Error(".ensure() will not recursivly create missing folders on Windows yet. Please submit a pull request if you fix this!");
	                //NOTE: On Windows, a file path will not start with /, but instead a drive letter or a UNC path. (Ie. C:, C:\ or \\)
				}
            }

            let lix = 0;
            while (lix != -1) {
                try {
                    lix = path.indexOf("/", lix + 1);
                    let newFolder = lix === -1 ? path : path.substring(0, lix);
                    await awaitable(cb => fs.mkdir(newFolder, 0o777, cb));
                }
                catch (err) {
                    if(err.code != "EEXIST") throw err;
                }

            }
        }
    }
}

function save(filename) {
    return {
        async json(data) {
            try {
                let jsondata = JSON.stringify(data);
                await awaitable(cb => fs.writeFile(filename, jsondata, { mode: "w" }, cb));
            }
            catch (err) {
                return undefined;
            }
        }
        // text
        // stream buffer
    };
}

module.exports = {
    load,
    save,
    folder
};