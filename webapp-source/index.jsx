import React from "react";
import ReactDOM from "react-dom";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { loadProjects } from "./api";
import { appReducer, appInitialState } from "./appState";
import { ProjectList } from "./projectList";

const store = createStore(appReducer, appInitialState, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

loadProjects(store.dispatch);

// var { protocol, host } = window.location;
// var wsProtocol = protocol == "http:" ? "ws" : "wss";
// var exampleSocket = new WebSocket(`${wsProtocol}://${host}`, "protocolOne");

// exampleSocket.onmessage = function (incoming) {
//     let event = JSON.parse(incoming.data);
//     console.log("-> ws from server", event);
//     //   let project = vm.projects().find(p => p.id == event.data.projectId);
//     //   project.status(event.data.status);
// }


ReactDOM.render(
    <Provider store={store}>
        <div>
            <p>Welcome to scriptabuild</p>
            <ProjectList />
        </div>
    </Provider>,
    document.getElementById('root')
);

