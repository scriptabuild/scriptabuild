const { readonlyProxy } = require("@scriptabuild/eventstore");

function DomainModel(dispatch, aggregator) {

    this.getProjectSummary = () => ({
        current: {
            buildNo: "N/I",
            buildStatus: "N/I",
            timestamp: "N/I"
        },
        latestCompleted: aggregator.data.builds[0],
        latestSuccesfull: aggregator.data.builds.find(build => build.status === "success")
    });

    this.getDetails = ({ maxNumberOfBuilds }) => ({
        current: "N/A",
        latest: aggregator.data.builds.slice(0, maxNumberOfBuilds),
        latestSuccesfull: aggregator.data.builds.find(build => build.status === "success")
    });

    this.getBuildDetails = ({ buildNo }) => aggregator.data.builds.find(build => build.buildNo === buildNo);
}



function Aggregator(snapshot) {
    let data = snapshot || {
        current: {
            buildNo: 12,
            status: "building",
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