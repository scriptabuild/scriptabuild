const express = require("express");
const http = require("http");
const url = require("url");
const path = require("path")
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

app.get("/", function (req, resp) {
	resp.redirect("/app/projects");
});

app.get("/app/*", function (req, resp) {
	resp.sendFile(__dirname + "/wwwroot/index.html");
});


app.get("/api/project-list",
	function (req, resp) {
    //TODO:
	});

app.get("/api/project-detail/:projectName",
	function (req, resp) {
    //TODO:
	});

app.get("/api/project-log/:projectName/:buildNo?",
	function (req, resp) {
    //TODO:
	});

app.post("/api/project-build/:projectname",
	function (req, resp) {
    //TODO:
	});

app.post("/api/hook/github/",
	bodyparser.json(),
	function (req, resp) {
    //TODO:
	});

app.post("/api/hook/bitbucket/",
	bodyparser.json(),
	function (req, resp) {
    //TODO:
	});

// app.all("/api/hook/record",
// 	bodyparser.raw(),
// 	function (req, resp) {
//     //TODO:
// 	});


// Server STARTUP code

server.listen(8080, function listening() {
  console.log(`Scriptabuild http server listening on ${server.address().port}`);
});
