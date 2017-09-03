import { getJsonOrFailOnHttpError } from "./fetch-utils";
import { initProjects, changeProjectState } from "./appState/projects";

export function loadProjects(dispatch) {
	return fetch("/api/project-list")
		.then(getJsonOrFailOnHttpError)
		.then(projects => {
			dispatch(initProjects(projects));
			projects.forEach(project => loadProject(project.id, dispatch));
		})
		.catch(err => void(console.log("fetching all projects failed:", err)));
}

function loadProject(projectId, dispatch) {
	dispatch(changeProjectState(projectId, null, "loading"));
	fetch(`/api/project-summary/${projectId}`)
		.then(getJsonOrFailOnHttpError)
		.then(({current}) => {
			dispatch(changeProjectState(projectId, current.status, current.statusText))
		})
		.catch(() => {
			dispatch(changeProjectState(projectId, null, "never built"));
		});
}

// let loadProject = (project) => {
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