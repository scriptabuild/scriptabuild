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
            let lix = 0;
            while (lix != -1) {
                try {
                    lix = path.indexOf("/", lix + 1);
                    let newFolder = lix === -1 ? path : path.substring(0, lix);
                    await awaitable(cb => fs.mkdir(newFolder, 0o777, cb));
                }
                catch (err) {
                    console.log("---", err);
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