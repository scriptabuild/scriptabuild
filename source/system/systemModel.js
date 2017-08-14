function DomainModel(dispatch, data) {
	this.getProjects = () => {
		return Object.entries(data.projects).map(([id, { name }]) => ({ id, name }));
	};

	this.getProject = (projectId) => {
		return data.projects[projectId];
	};

	this.getActiveProjects = (numberOfDays) => ([{
		id: "N/I",
		name: "N/I",
		description: "N/I"
	}]);

	this.setProject = (projectId, project) => {
		if (project.id != projectId) {
			throw new Error("Invalid data: mismatched projectId");
		}
		if (!projectId || !project) {
			throw new Error("Invalid data: incomplete data");
		}
		dispatch("projectSet", { projectId, project });

		//TODO: raise external event!?

		//  - checkout, build, artifacts folder
		//  - source / git endpoint
		//  - branch

	}

	this.removeProject = ({ projectId }) => {
		dispatch("projectRemoved", projectId);

		//TODO: raise external event!?
	}
}



function Aggregator(data) {
	this.eventHandlers = {
		onProjectSet: ({ projectId, project }) => {
			let prevProject = data.projects[projectId] ||  {};
			data.projects[projectId] = Object.assign({}, prevProject, project);
		},
		onProjectRemoved: ({ projectId }) => {
			delete data.projects[projectId];
		}
	}
}



const modelDefinition = {
	snapshotName: () => "system-configuration",
	initializeLogAggregatorData: () => ({projects:{}}),
	createLogAggregator: (data) => new Aggregator(data),
	createDomainModel: (dispatch, data) => new DomainModel(dispatch, data)
}



module.exports = modelDefinition;