console.log("Welcome to Scriptabuild server");

let throwHttpError = (response) => {
    throw new Error(`Fetch(...) returned an error: ${response.status} ${response.statusText}`);
}
let getJsonOrFailOnHttpError = (response) => response.ok ? response.json() : throwHttpError(response)

let loadProject = (project) => {
    let status = ko.observable("[loading]");
    project.status = status;
    fetch(`/api/project-summary/${project.id}`)
        .then(getJsonOrFailOnHttpError)
        .then(res => void(status(res.current.buildStatus)))
        .catch(() => void(status("never built")));
}

let loadProjects = (vm) => {
    fetch("/api/project-list")
        .then(getJsonOrFailOnHttpError)
        .then(projects => {
            projects.forEach(loadProject);
            vm.projects.push(...projects);
        })
        .catch(err => void(console.log("fetching all projects failed:", err)));

}

let buildProject = (project) => {
	fetch(`/api/project-build/${project.id}`, {method: "post"})
		.then(getJsonOrFailOnHttpError)
		.then(() => void(project.status("requesting build")))
		.catch(() => void(project.status("request failed")));
}

//------------



let vm = {
	projects: ko.observableArray([]),
	buildProject
}

ko.applyBindings(vm);
loadProjects(vm);


