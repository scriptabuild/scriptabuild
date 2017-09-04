import React from "react";
import ReactDOM from "react-dom";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { loadProjects } from "./api";
import { initializeSocket } from "./websockets";
import { appReducer, appInitialState } from "./appState";
import { ProjectList } from "./components/ProjectList";

const store = createStore(appReducer, appInitialState, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

loadProjects(store.dispatch);
initializeSocket(store.dispatch);


ReactDOM.render(
    <Provider store={store}>
        <div>
            <p>Welcome to scriptabuild</p>
            <ProjectList />
        </div>
    </Provider>,
    document.getElementById('root')
);

