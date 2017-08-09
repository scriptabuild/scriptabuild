const { readonlyProxy } = require("@scriptabuild/eventstore");

function DomainModel(dispatch, aggregator) {

    this.getProjectSummary = () => ({
        //TODO: return ONLY the needed data for this operation
        current: aggregator.data.current,
        latestCompleted: aggregator.data.builds[0],
        latestSuccesfull: aggregator.data.builds.find(build => build.status === "success")
    });

    this.getDetails = ({ maxNumberOfBuilds }) => ({
        //TODO: return ONLY the needed data for this operation
        current: "N/A",
        latest: aggregator.data.builds.slice(0, maxNumberOfBuilds),
        latestSuccesfull: aggregator.data.builds.find(build => build.status === "success")
    });

    this.getBuildDetails = ({ buildNo }) => aggregator.data.builds.find(build => build.buildNo === buildNo);

    this.getBuildLog = ({ buildNo }) => aggregator.data.builds.find(build => build.buildNo === buildNo).log;
}



function Aggregator(snapshot) {
    let data = snapshot || {
        current: {
            buildNo: 12,
            buildStatus: "building",
            timestamp: "N/I"
        },
        builds: [{
            buildNo: "N/I",
            buildStatus: "success",
            commitHash: "N/I",
            timestamp: "N/I",
            duration: "N/I",
            startedBy: "N/I",
            log: [],
            artifacts: []
        }]
    };
    Object.defineProperty(this, "data", { value: readonlyProxy(data), writable: false });

    this.eventhandlers = {

    }
}



const modelDefinition = {
    snapshotName: () => "project-details",
    createDomainModel: (dispatch, aggregator) => new DomainModel(dispatch, aggregator),
    createLogAggregator: (snapshot) => new Aggregator(snapshot)
}



module.exports = modelDefinition;