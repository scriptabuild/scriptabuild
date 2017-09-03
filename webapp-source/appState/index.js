import {projectsReducer} from "./projects";

export const appInitialState = {projects: []};

export function appReducer(state, action) {
	state = projectsReducer(state, action);
	return state;
}