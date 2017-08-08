const http = require("http");
const url = require("url");
const path = require("path")

const { load, save, folder } = require("./fs-utils");

const express = require("express");
const cors = require("cors");
const bodyparser = require("@aeinbu/bodyparser");
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.broadcast = function broadcast(data) {
    wss.clients.forEach(function each(client) {
        console.log("WS send", JSON.stringify(data));
        client.send(JSON.stringify(data));
    });
};

wss.on("connection", function connection(ws) {
    const location = url.parse(ws.upgradeReq.url, true);
    // You might use location.query.access_token to authenticate or share sessions
    // or ws.upgradeReq.headers.cookie (see http://stackoverflow.com/a/16395220/151312)

    ws.on("message", function incoming(message) {
        console.log(`received: ${message}`);
        ws.send(`I got ${message}`);
        wss.broadcast("this is a public message!!!")
    });

    ws.send("You have connected to scriptabuild!!!");
});



app.use("/app/", express.static(path.join(__dirname, "wwwroot")));

app.use(cors());

app.get("/", function(req, resp) {
    resp.redirect("/app/projects");
});

app.get("/app/*", function(req, resp) {
    resp.sendFile(__dirname + "/wwwroot/index.html");
});

// async function getProjects(){
// 	const filename = path.resolve(process.cwd(), "demo/projects.json")
// 	return await load(filename).json();
// }

// async function getProject(projectname){
// 	let projects = await getProjects();
// 	return projects.find(project => project.name === projectname);
// }

const systemModelDefinition = require("./models/systemModel");
const projectModelDefinition = require("./models/projectModel");
const { defineStore } = require("@scriptabuild/eventstore");

const configuration = {
    systemFolder: path.resolve(process.cwd(), "demo")
};

async function getSystemModel() {
    let systemFolder = path.resolve(configuration.systemFolder, "system-log");
    let store = await defineStore(systemFolder);
    let model = store.defineModel(systemModelDefinition);

    return model;
}

function getProjectLogFolder(projectId) {
    let projectFolder = path.resolve(configuration.systemFolder, "projects", projectId, "project-log");
    return projectFolder;
}

async function ensureProjectLogFolder(projectId) {
    let projectFolder = getProjectLogFolder(projectId);
    await folder(projectFolder).ensure();
}

async function getProjectModel(projectId) {
    let projectFolder = getProjectLogFolder(projectId);
    // await folder(projectFolder).ensure();
    let store = await defineStore(projectFolder);
    let model = store.defineModel(projectModelDefinition);

    return model;
}


app.get("/api/project-list",
    async function(req, resp) {
        const systemModel = await getSystemModel();
        await systemModel.withReadInstance(instance => {
            let res = instance.getProjects();
            resp.json(res);
        });
    });


app.get("/api/project-summary/:projectId",
    async function(req, resp) {
        try {
            let projectId = req.params.projectId;
            let projectModel = await getProjectModel(projectId);
            projectModel.withReadInstance(instance => {
                let res = instance.getSummary();
                resp.json(res);
            });
        }
        catch (err) {
            resp.sendStatus(404);
        }
    });


app.get("/api/project-detail/:projectId",
    async function(req, resp) {
        try {
            let projectId = req.params.projectId;
            let projectModel = await getProjectModel(projectId);
            projectModel.withReadInstance(instance => {
                let res = instance.getDetails({ maxNumberOfBuilds: 8 });
                resp.json(res);
            });
        }
        catch (err) {
            resp.sendStatus(404);
        }
    });


app.get("/api/build-detail/:projectId/:buildNo",
    async function(req, resp) {
        try {
            let projectId = req.params.projectId;
            let buildNo = req.params.buildNo;
            let projectModel = await getProjectModel(projectId);
            projectModel.withReadInstance(instance => {
                let res = instance.getBuildDetails({ buildNo });
                resp.json(res);
            });
        }
        catch (err) {
            resp.sendStatus(404);
        }
    });


app.get("/api/project-log/:projectName/:buildNo?",
    function(req, resp) {
        //TODO: show output from specific build
    });

app.post("/api/project-build/:projectname",
    function(req, resp) {
        //TODO: start build
        // clone or checkout
        // update deps (npm, nuget etc)
        // run scripts to build etc
        // log status
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

server.listen(8080, function listening() {
    console.log(`Scriptabuild http server listening on http://localhost:${server.address().port}`);
    console.log(`Press CTRL+C to stop http server...`)
});