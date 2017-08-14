const http = require("http");
const url = require("url");
const path = require("path")

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


app.get("/api/build-detail/:projectId/:buildNo",
    doesProjectExistMiddleware,
    async function(req, resp) {
        let projectId = req.params.projectId;
        let buildNo = req.params.buildNo;
        let projectModel = await getProjectModel(projectId);
        projectModel.withReadInstance(instance => {
            let res = instance.getBuildDetails({ buildNo });
            resp.json(res);
        });
    });


app.get("/api/build-log/:projectId/:buildNo?",
    doesProjectExistMiddleware,
    async function(req, resp) {
        let projectId = req.params.projectId;
        let buildNo = req.params.buildNo;
        let projectModel = await getProjectModel(projectId);
        projectModel.withReadInstance(instance => {
            let res = instance.getBuildLog({ buildNo });

            resp.json(res);
        });
    });

app.post("/api/project-build/:projectId",
    async function(req, resp) {
        let projectId = req.params.projectId;

        //TODO: start build
        await ensureProject(projectId); // in system
        await ensureProjectLogFolder(projectId); // in project's folder
        // clone or checkout
        // update deps (npm, nuget etc)
        // run scripts to build etc
        // log status

        resp.sendStatus(204);
    
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