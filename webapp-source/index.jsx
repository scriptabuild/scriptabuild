import React from "react";
import ReactDOM from "react-dom";

import {ProjectList} from "./projectList";


// let loadProject = (project) => {
//     project.status = "loading";
//     fetch(`/api/project-summary/${project.id}`)
//         .then(getJsonOrFailOnHttpError)
//         .then(res => void(project.status = res.current.status))
//         .catch(() => void(project.status = "never built"));
// }

// let loadProjects = (vm) => {
//     fetch("/api/project-list")
//         .then(getJsonOrFailOnHttpError)
//         .then(projects => {
//             projects.forEach(loadProject);
//             vm.projects.push(...projects);
//         })
//         .catch(err => void(console.log("fetching all projects failed:", err)));
// }

// let buildProject = () => void(0);
// let buildProject = (project) => {
//     let buildId = new Date().toISOString();
// 	fetch(`/api/project-build/${project.id}/${buildId}`, {method: "post"})
// 		.then(getEmptyOrFailOnHttpError)
// 		.then(() => void(project.status("requesting build")))
// 		.catch(() => void(project.status("request failed")));
// }

//------------

var {protocol, host} = window.location;
var wsProtocol = protocol == "http:" ? "ws" : "wss";
var exampleSocket = new WebSocket(`${wsProtocol}://${host}`, "protocolOne");
 
exampleSocket.onmessage = function (incoming) {
  let event = JSON.parse(incoming.data);
  console.log("-> ws from server", event );
//   let project = vm.projects().find(p => p.id == event.data.projectId);
//   project.status(event.data.status);
}


ReactDOM.render(
    <div>
        <p>Welcome to scriptabuild</p>
        <ProjectList />
    </div>,
    document.getElementById('root')
);
