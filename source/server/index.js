const http = require("http");
// const url = require("url");
const path = require("path");
const transform = require("../system/transform");
const executeTask = require("../system/executeTask");
// const {spawn} = require('child_process');
// const spawnargs = require('spawn-args');

const express = require("express");
const cors = require("cors");
const bodyparser = require("@aeinbu/bodyparser");
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.broadcast = function broadcast(data) {
    wss.clients.forEach(function each(client) {
        // console.log("WS send", JSON.stringify(data));
        client.send(JSON.stringify(data));
    });
};

wss.on("connection", function connection(ws) {
    // const location = url.parse(ws.upgradeReq.url, true);
    // You might use location.query.access_token to authenticate or share sessions
    // or ws.upgradeReq.headers.cookie (see http://stackoverflow.com/a/16395220/151312)

    ws.on("message", function incoming(message) {
        // console.log(`received: ${message}`);
        ws.send(`I got ${message}`);
        // wss.broadcast("this is a public message!!!")
    });

    // ws.send("You have connected to scriptabuild!!!");
});



app.use("/app/", express.static(path.resolve(__dirname, "../../dist")));

app.use(cors());

app.get("/", function(req, resp) {
    resp.redirect("/app/projects");
});

app.get("/app/*", function(req, resp) {
    resp.sendFile(path.resolve(__dirname, "../../dist/index.html"));
});



const { getSystemModel, doesProjectExistMiddleware, ensureProject } = require("../system");
const { ensureProjectLogFolder, getProjectModel } = require("../project");

app.get("/api/project-list",
    async function(req, resp) {
        const systemModel = await getSystemModel();
        await systemModel.withReadInstance(instance => {
            let res = instance.getProjects();
            resp.json(res);
        });
    });
      
app.get("/api/project-summary/:projectId",
    doesProjectExistMiddleware,
    async function(req, resp) {
        try {
            let projectId = req.params.projectId;
            let projectModel = await getProjectModel(projectId);
            projectModel.withReadInstance(instance => {
                let res = instance.getProjectSummary();
                resp.json(res);
            });
        }
        catch (err) {
            resp.sendStatus(404);
        }
    });


app.get("/api/project-detail/:projectId",
    doesProjectExistMiddleware,
    async function(req, resp) {
        let projectId = req.params.projectId;
        let projectModel = await getProjectModel(projectId);
        projectModel.withReadInstance(instance => {
            let res = instance.getProjectDetails({ maxNumberOfBuilds: 8 });
            resp.json(res);
        });
    });


app.get("/api/build-detail/:projectId/:buildId",
    doesProjectExistMiddleware,
    async function(req, resp) {
        let projectId = req.params.projectId;
        let buildId = req.params.buildId;
        let projectModel = await getProjectModel(projectId);
        projectModel.withReadInstance(instance => {
            let res = instance.getBuildDetails({ buildId });
            resp.json(res);
        });
    });


app.get("/api/build-log/:projectId/:buildId?",
    doesProjectExistMiddleware,
    async function(req, resp) {
        let projectId = req.params.projectId;
        let buildId = req.params.buildId;
        let projectModel = await getProjectModel(projectId);
        projectModel.withReadInstance(instance => {
            let res = instance.getBuildLog({ buildId });

            resp.json(res);
        });
    });
        

app.post("/api/project-build/:projectId/:buildId?",
    async function(req, resp) {
        let projectId = req.params.projectId;
        let buildId = req.params.buildId;

        resp.sendStatus(204);

        //TODO: start build
        await ensureProject(projectId); // in system
        await ensureProjectLogFolder(projectId); // in project's folder
        
        let model = getProjectModel(projectId);

        await model.withReadWriteInstance((instance, readyToCommit) => {
            instance.startBuild({buildId});
            readyToCommit();
        });
        wss.broadcast({name: "buildStatusUpdated", data: {projectId, buildId, status: "started", statusText: "build started"}});
        
        let dictionary = {
            repositorrooturl: "https://github.com/scriptabuild",
            repositoryname: "eventstore",
            repositorurl: "%repositorrooturl%/%repositoryname%.git",
            tempfolder: "/Users/arjan/dev/scriptabuild/temp/projects/",
            projectrootfolder: "%tempfolder%/%repositoryname%",
            checkoutfolder: "%projectrootfolder%/checkout",
        }

        let transFn = obj => transform(obj, dictionary);

        let gitCleanTask = { cmd: "git", args: ['clean', "--force"], options: { cwd: "%checkoutfolder%" } };
        let gitPullTask = { cmd: "git", args: ['pull'], options: { cwd: "%checkoutfolder%" } };
        let gitCloneTask = { cmd: "git", args: ['clone', "%repositorurl%", "%checkoutfolder%"], options: { cwd: "%projectrootfolder%" } };
        
        console.log("***", gitCleanTask, transFn(gitCleanTask));
        console.log("***", gitPullTask, transFn(gitPullTask));
        console.log("***", gitCloneTask, transFn(gitCloneTask));

        await executeTask(gitCloneTask, {transFn});
        // TODO: git clone or git checkout
        // does "%checkoutfolder%/.git" exist,

        // yes: move to %checkoutfolder% folder
        // { cmd: "git", args: ['clean', "--force"], options: { cwd: "%checkoutfolder%" } }
        // { cmd: "git", args: ['fetch'], options: { cwd: "%checkoutfolder%" } }
            
        // no: stay in %projectrootfolder% folder
        // { cmd: "git", args: ['clone', project.source.url, "%checkoutfolder%"], options: { cwd: "%projectrootfolder%" } }
			
        // { cmd: "git", args: ['checkout', pathspec], options: { cwd: "%build%" } }

        // Get commithash and branchname from git
				// exec("git rev-parse --short HEAD", { cwd: ctx.paths.build }, function (err, stdout, stderr) {
				// 	let commitHash = stdout.split('\n').join('');
				// 	exec("git rev-parse --abbrev-ref HEAD", { cwd: ctx.paths.build }, function (err, stdout, stderr) {
				// 		let branch = stdout.split('\n').join('');
				// 		setBuildSettingsSync(ctx.paths.sandbox, ctx.paths.buildNo, {commitHash, branch});
				// 	});
				// })
				


        await model.withReadWriteInstance((instance, readyToCommit) => {
            instance.reportBuildProgress({buildId, status: "running", statusText: "doing something"});
            readyToCommit();
        });
        wss.broadcast({name: "buildStatusUpdated", data: {projectId, buildId, status: "running", statusText: "doing something"}});
        wss.broadcast({name: "buildCompleted", data: {projectId, buildId, status: "started", statusText: "doing something"}});
        
        // TODO: run build script in %checkoutfolder% or in %projectfolder% ?

        await model.withReadWriteInstance((instance, readyToCommit) => {
            instance.buildComplete({buildId, didSucceed: true});            
            readyToCommit();
        });
        wss.broadcast({name: "buildCompleted", data: {projectId, buildId, status: "succeeded", statusText: "build succeeded"}});
        

    });

app.post("/api/hook/github/",
    bodyparser.json(),
    function(req, resp) {
        //TODO: start build
    });

app.post("/api/hook/bitbucket/",
    bodyparser.json(),
    function(req, resp) {
        //TODO: start build
    });

// app.all("/api/hook/record",
// 	bodyparser.raw(),
// 	function (req, resp) {
//     //TODO:
// 	});

// Server STARTUP code

server.listen(8081, function listening() {
    console.log(`Scriptabuild http server listening on http://localhost:${server.address().port}`);
    console.log(`Press CTRL+C to stop http server...`)
});