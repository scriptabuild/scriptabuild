import { getJsonOrFailOnHttpError, getEmptyOrFailOnHttpError } from "./fetch-utils";
import { initProjects, changeProjectState } from "../appState/projects";


export function loadProjects(dispatch) {
    return fetch("/api/project-list")
        .then(getJsonOrFailOnHttpError)
        .then(projects => {
            dispatch(initProjects(projects));
            projects.forEach(project => loadProject(project.id, dispatch));
        })
        .catch(err => void(console.log("fetching all projects failed:", err)));
}


export function loadProject(projectId, dispatch) {
    dispatch(changeProjectState(projectId, null, "loading"));
    fetch(`/api/project-summary/${projectId}`)
        .then(getJsonOrFailOnHttpError)
        .then(({ current }) => {
            dispatch(changeProjectState(projectId, current.status, current.statusText))
        })
        .catch(() => {
            dispatch(changeProjectState(projectId, null, "never built"));
        });
}


export function buildProject(projectId, dispatch) {
    let buildId = new Date().toISOString();
    fetch(`/api/project-build/${projectId}/${buildId}`, { method: "post" })
        .then(getEmptyOrFailOnHttpError)
        .then(() => {
            dispatch(changeProjectState(projectId, "started", "requesting build"))
        })
        .catch(() => {
            dispatch(changeProjectState(projectId, "failed", "build request failed"))
        });
}