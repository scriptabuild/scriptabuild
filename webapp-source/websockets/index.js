
import { changeProjectState } from "../appState/projects";


export function initializeSocket(dispatch) {
    var { protocol, host } = window.location;
    var wsProtocol = protocol == "http:" ? "ws" : "wss";
    var exampleSocket = new WebSocket(`${wsProtocol}://${host}`, "protocolOne");

    exampleSocket.onmessage = function(incoming) {
        let event = JSON.parse(incoming.data);
		console.log("-> ws from server", event);
		
		if(event.name === "buildStatusUpdated" || event.name === "buildCompleted"){
			let {projectId, status, statusText} = event.data;
			dispatch(changeProjectState(projectId, status, statusText))
		}
    }
}
