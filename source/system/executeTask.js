const { spawn } = require("child_process");
const spawnargs = require("spawn-args");

module.exports = async function executeTask(task, options) {
    try {
        let transFn = options.transFn ;//|| (x => x);
        let tasks = Array.isArray(task) ? task : [task];
        for (let ix = 0; ix < tasks.length; ix++) {
            task = transFn(task);

            let { cmd, args, options = options } = resolveParams(task);

            options = {
                cwd: transFn("%build%"),
                shell: true,
                // stdio: "inherit",
                ...options
            }

            await runSpawn(cmd, args, options);

            //TODO: record success into eventstore
        }
    }
    catch (err) {
        //TODO: Record failure to eventstore log
        //TODO: exit on error
    }
}

// task can be either a string or an object. This function transforms the task to a params object.
function resolveParams(task) {
    if (typeof task === "string") {
        var args = spawnargs(task);

        task = {
            cmd: args[0],
            args: args.slice(1)
        };
        return task;
    }

    return task;
}

function runSpawn(cmd, args, options) {
    return new Promise(function(resolve, reject) {

        // logger.info(hkey.key, `┏━━━━ Starting child process`);
        // logger.info(hkey.key, `"${cmd} ${args.join(" ")}"`);
        // // logger.info({ cmd, args, options });

        const proc = spawn(cmd, args, options);

        proc.stdout.on('data', data => {
			console.log("stdout:data:", data.toString());
            // data.toString().split("\n").forEach(line => logger.info(hkey.key, line));
        });

        var message = "";
        proc.stderr.on('data', data => {
			console.log("stderr:data:", data.toString());
            // data.toString().split("\n").forEach(line => logger.error(hkey.key, line));

            // message += data + "\n";
        });

        proc.on('exit', (code, signal) => {
			console.log("exit:", code, signal);
			
            if (code == 0) {
                // logger.info(hkey.key, `┗━━━━ Child process exited with code 0`);
                resolve();
            }
            else if (code) {
                // logger.error(hkey.key, `┗━━━━ Child process exited with code ${code}`);
                reject({ name: "ChildProcessError", message, code });
            }
            else {
                // logger.error(hkey.key, `┗━━━━ Child process exited with signal "${signal}"`);
                reject({ name: "ChildProcessError", message, code });
            }
        });

        proc.on('error', err => {
            // logger.error(hkey.key, `┗━━━━ Child process failed with error ${err.name} ("${err.message}")`);
            reject({ name: "ChildProcessError", message: err.message });
        });
    });
}