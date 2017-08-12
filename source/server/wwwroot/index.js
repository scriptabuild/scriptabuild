console.log("Welcome to Scriptabuild server");

let throwHttpError = (response) => {
	throw new Error(`Fetch(...) returned an error: ${response.status} ${response.statusText}`);
}
let getJsonOrFailOnHttpError = (response) => response.ok? response.json(): throwHttpError(response)

console.log("---fetching all projects...")
fetch("http://localhost:8080/api/project-list")
    .then(getJsonOrFailOnHttpError)
    .then(projects => {
        console.log("fetching all projects succeeded:", projects);
        ko.applyBindings({projects})
    })
    .catch(err => {
        console.log("fetching all projects failed:", err);
    });


console.log("---fetching a project...")
fetch("http://localhost:8080/api/project-detail/Script-a-build")
    .then(getJsonOrFailOnHttpError)
    .then(data => {
        console.log("fetching a project succeeded:", data);
    })
    .catch(err => {
        console.log("fetching a project failed:", err);
    });