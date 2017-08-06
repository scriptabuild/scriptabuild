const { readonlyProxy } = require("@scriptabuild/readonlyproxy");

function DomainModel(dispatch, aggregator) {

    this.getProjectSummary = () => ({
        name: "N/I",
        current: {
            buildNo: "N/I",
            buildStatus: "N/I",
            timestamp: "N/I"
        },
        latestCompleted: {
            buildNo: "N/I",
            buildStatus: "N/I",
            timestamp: "N/I"
        },
        latestSuccesfull: {
            buildNo: "N/I",
            buildStatus: "success",
            timestamp: "N/I"
        },
        trend: "Cloudy"
    });

    this.getDetails = ({ maxNumberOfBuilds }) => ({
        name: "N/I",
        current: {
            buildNo: "N/I",
            buildStatus: "N/I",
            commitHash: "N/I",
            timestamp: "N/I",
            duration: "N/I",
            startedBy: "N/I"
        },
        latest: [{
            buildNo: "N/I",
            buildStatus: "N/I",
            commitHash: "N/I",
            timestamp: "N/I",
            duration: "N/I",
            startedBy: "N/I"
        }, {
            buildNo: "N/I",
            buildStatus: "N/I",
            commitHash: "N/I",
            timestamp: "N/I",
            duration: "N/I",
            startedBy: "N/I"
        }],
        latestSuccesfull: {
            buildNo: "N/I",
            buildStatus: "success",
            commitHash: "N/I",
            timestamp: "N/I",
            duration: "N/I",
            startedBy: "N/I"
        },
        trend: "Cloudy"
    });

    this.getBuildDetails = ({ buildNo }) => ({
        buildNo: "N/I",
        buildStatus: "success",
        commitHash: "N/I",
        timestamp: "N/I",
        duration: "N/I",
        startedBy: "N/I",
        log: [],
        artifacts: []
    });
}



function Aggregator(snapshot) {
    let data = snapshot || {
        projects: []
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