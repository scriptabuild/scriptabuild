function DomainModel(dispatch, data) {

    this.getProjectSummary = () => {
		let current = data.current;
		let latestCompletedBuild = data.builds[0];
		let latestSuccesfullBuild = data.builds.find(build => build.buildStatus === "success")

		return {
            current: { buildNo: current.buildNo, status: data.current.status },
            latestCompleted: latestCompletedBuild && { buildNo: latestCompletedBuild.buildNo, status: latestCompletedBuild.buildStatus},
            latestSuccesfull: latestSuccesfullBuild && { buildNo: latestSuccesfullBuild.buildNo, status: latestSuccesfullBuild.buildStatus}
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
		//TODO:
    }
}



const modelDefinition = {
    snapshotName: () => "project-details",
    initializeLogAggregatorData: () => ({}),
    createLogAggregator: (data) => new Aggregator(data),
    createDomainModel: (dispatch, data) => new DomainModel(dispatch, data)
}



module.exports = modelDefinition;