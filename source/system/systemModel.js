const readonlyProxy = require("@scriptabuild/readonlyproxy");

function DomainModel(dispatch, aggregator) {
    this.getProjects = () => Object.entries(aggregator.data.projects).map(([id, {name}]) => ({id, name}));

    this.getProject = ({projectId}) => aggregator.data.projects[projectId];
    
    this.getActiveProjects = (numberOfDays) => ([{
        id: "...",
        name: "project 1",
        description: ""
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



function Aggregator(snapshot) {
    let data = snapshot || {
        projects: {
            "scriptabuild": {
                name: "Scriptabuild",
                source: {
                    provider: "git",
                    url: "https://github.com/scriptabuild/arjanpoc",
                    branch: "master"
				},
				// checkoutFolder: "scriptabuild",
                run: [
                    "npm update",
                    "npm build"
                ]
            },
            "scriptabuild-samples": {
                name: "Scriptabuild samples",
                source: {
                    provider: "git",
                    url: "https://github.com/scriptabuild/samples.git",
                    branch: "master"
				},
				// checkoutFolder: "scriptabuild-samples",
                run: [{
                        cmd: "npm",
                        args: ["update"],
                        options: { cwd: "%build%" }
                    },
                    "npm update",
                    "sh %build%/batchfile",
                    "node %build%/build-node-app.js"
                ]
            },
        }
    };
    Object.defineProperty(this, "data", { value: readonlyProxy(data), writable: false });

    this.eventhandlers = {
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
    createDomainModel: (dispatch, aggregator) => new DomainModel(dispatch, aggregator),
    createLogAggregator: (snapshot) => new Aggregator(snapshot)
}



module.exports = modelDefinition;