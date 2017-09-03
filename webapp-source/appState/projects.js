const INIT_PROJECTS = "INIT_PROJECTS";
const CHANGE_PROJECT_STATE = "CHANGE_PROJECT_STATE";

export const initProjects = (projects) => ({type: INIT_PROJECTS, projects});
export const changeProjectState = (id, status, statusText) => ({type: CHANGE_PROJECT_STATE, id, status, statusText});

export function projectsReducer(state, action){
	switch(action.type){
		case INIT_PROJECTS:
			return {
				...state,
				projects: [
					...action.projects
				]
			};
		
		case CHANGE_PROJECT_STATE: {
			let ix = state.projects.findIndex(project => project.id === action.id);
			let changedProject = {
				...state.projects[ix],
				status: action.status,
				statusText: action.statusText
			};
			return {
				...state,
				projects: [
					...state.projects.slice(0, ix), changedProject, ...state.projects.slice(ix+1)
				]
			}
		}

		default:
			return state;
	}
}