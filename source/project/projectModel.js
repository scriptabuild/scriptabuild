function DomainModel(dispatch, data) {

    this.getProjectSummary = () => {
        let current = data.current;
        let latestCompletedBuild = data.builds[0];
        let latestSuccesfullBuild = data.builds.find(build => build.buildStatus === "success")

        return {
            current: { buildNo: current.buildNo, buildStatus: current.buildStatus },
            latestCompleted: latestCompletedBuild && { buildNo: latestCompletedBuild.buildNo, buildStatus: latestCompletedBuild.buildStatus },
            latestSuccesfull: latestSuccesfullBuild && { buildNo: latestSuccesfullBuild.buildNo, buildStatus: latestSuccesfullBuild.buildStatus }
        }
    };

    this.getProjectDetails = ({ maxNumberOfBuilds }) => {
        let current = data.current;
        let latestCompletedBuilds = data.builds.filter((build, index) => index < maxNumberOfBuilds);
        let latestSuccesfullBuild = data.builds.find(build => build.buildStatus === "success")

        return {
            current: current,
            latest: latestCompletedBuilds,
            latestSuccesfull: latestSuccesfullBuild
        };
    };

    this.getBuildDetails = ({ buildNo }) => data.builds.find(build => build.buildNo === buildNo);

    this.getBuildLog = ({ buildNo }) => data.builds.find(build => build.buildNo === buildNo).log;

    this.startBuild = ({ buildNo }) => {
        dispatch("buildStarted", {
			buildNo,
			buildStatus: "building",
            timestamp: new Date().toISOString()
		});
		//TODO: raise external event => ws
    }

	this.reportBuildProgress = ({ buildNo, buildStatus }) => {
        dispatch("buildProgressReported", {
			buildNo,
			buildStatus,
            timestamp: new Date().toISOString()
		});
		//TODO: raise external event => ws		
    }
}



function Aggregator(data) {
    // let data = snapshot || {
    //     current: {
    //         buildNo: 12,
    //         buildStatus: "building",
    //         timestamp: "N/I"
    //     },
    //     builds: [{
    //         buildNo: "N/I",
    //         buildStatus: "failed",
    //         commitHash: "N/I",
    //         timestamp: "N/I",
    //         duration: "N/I",
    //         startedBy: "N/I",
    //         log: [],
    //         artifacts: []
    //     },{
    //         buildNo: "N/I",
    //         buildStatus: "success",
    //         commitHash: "N/I",
    //         timestamp: "N/I",
    //         duration: "N/I",
    //         startedBy: "N/I",
    //         log: [],
    //         artifacts: []
    //     }]
    // };

    this.eventHandlers = {
		onBuildStarted: ({buildNo, buildStatus, timestamp}) => {
			data.current = {
				buildNo,
				buildStatus,
				timestamp
			}
		},

		onBuildProgressReported: ({buildNo, buildStatus, timestamp}) => {
			data.current = {
				buildNo,
				buildStatus,
				timestamp
			}

		}
	}
}



const modelDefinition = {
    snapshotName: () => "project-details",
    initializeLogAggregatorData: () => ({ current: { buildStatus: "unknown" }, builds: [] }),
    createLogAggregator: (data) => new Aggregator(data),
    createDomainModel: (dispatch, data) => new DomainModel(dispatch, data)
}



module.exports = modelDefinition;