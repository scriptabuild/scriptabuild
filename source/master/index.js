const initStore = require("../store")
const Project = require("./project");

const folder = "/users/arjan/temp/demostore";
const createFunc = (dispatch, reh, rsh) => {
	return new Project(dispatch, reh, rsh);
};
initStore(folder, createFunc)
	.withRetries((project, rollback) => {
		project.addProject("project no 401-1");
		console.log("--->", project.getProjects())
		rollback();
	})
	.withRetries((project, rollback) => {
		project.addProject("project no 401-2");
		console.log("--->", project.getProjects())
	})
	.withRetries((project, rollback) => {
		project.addProject("project no 401-3");
		console.log("--->", project.getProjects())
		rollback();
	})
	.snapshot();