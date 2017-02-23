const Store = require("../store");

module.exports = function Project(dispatch, registerEventHandlers, registerSnapshothandlers) {

	let projects = [];

	// optional
	registerSnapshothandlers({
		restoreFromSnapshot: snapshotData => { projects = snapshotData},
		createSnapshotData: () => projects
	});

	registerEventHandlers({
		onProjectAdded: event => projects.push(event),
		onProjectRemoved: function(event){ projects.splice(event.index, 1); }
	});

	// commands on Project object - custom
	this.addProject = name => {
		dispatch("projectAdded", {
			name
		});
	};

	this.removeProject = index => {
		dispatch("projectRemoved", {
			index
		});
	};

	this.getProjects = () => projects;
}