console.log("Welcome to Scriptabuild server");

console.log("---fetching all projects...")
fetch("http://localhost:8080/api/project-list")
	.then(response => response.json())
	.then(data => {
		console.log("fetching all projects succeeded:", data);
	})
	.catch(err => {
		console.log("fetching all projects failed:", err);
	});

console.log("---fetching a project...")
fetch("http://localhost:8080/api/project-detail/Script-a-build")
	.then(response => response.json())
	.then(data => {
		console.log("fetching a project succeeded:", data);
	})
	.catch(err => {
		console.log("fetching a project failed:", err);
	});

