const initStore = require("../store")
const Project = require("./project");


// TEST
// -ensure log isnt played back twice on same instance
// -cancel -> UnderlyingStore MUST be able to instantiate NEW instances
// -trying to record commands on an instance after cancelling a save -> should throw/unknown state
// -concurrency
// -snapshot (ok)
// -replay w/snapshot (ok)
// -replay missing a file (ok)



const folder = "/users/arjan/temp/demostore";
const createFunc = (d, reh, rsh) => {
	return new Project(d, reh, rsh);
};
const store = initStore(folder, createFunc)
	.withRetries((project, cancel) => {
		console.log("--->", project.getProjects())
		project.addProject("project no 401-1");
		// console.log("@@@", project)
		// cancel();
	})
	// .snapshot();