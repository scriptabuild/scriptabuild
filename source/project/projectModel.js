const STATUS = require("./status");

function DomainModel(dispatch, data) {

    this.getProjectSummary = () => {
        let builds = Object.keys(data.builds)
            .sort()
            .map(key => data.builds[key])
            .map(({ buildId, status, statusText, timestamp }) => ({ buildId, status, statusText, timestamp }));
        let current = builds[0];
        let latestCompleted = builds.find(build => build.complete);
        let latestSuccesfull = builds.find(build => build.complete && build.status === STATUS.succeeded);
        return {
            current,
            latestCompleted,
            latestSuccesfull
        }
    };

    this.getProjectDetails = ({ maxNumberOfBuilds }) => {
        // let builds = Object.keys(data.builds).sort().map(key => data.builds[key]);
        // let current = builds[0];
        // let latestCompleted = builds.filter(build => build.complete);
        // let latestSuccesfull = data.builds.find(build => build.complete && build.buildStatus === "success");
        // return {
        //     current: current,
        //     latest: latestCompletedBuilds,
        //     latestSuccesfull: latestSuccesfullBuild
        // };
    };

    this.getBuildDetails = ({ buildId }) => data.builds.find(build => build.buildId === buildId);

    this.getBuildLog = ({ buildId }) => data.builds.find(build => build.buildId === buildId).log;

    this.startBuild = ({ buildId }) => {
        dispatch("buildStarted", {
            buildId,
            status: STATUS.started,
            statusText: "building",
            timestamp: new Date().toISOString()
        });
        //TODO: raise external event => ws
    }

    this.reportBuildProgress = ({ buildId, statusText }) => {
        dispatch("buildProgressReported", {
            buildId,
            status: STATUS.started,
            statusText,
            timestamp: new Date().toISOString()
        });
        //TODO: raise external event => ws		
    }

    this.buildComplete = ({ buildId, didSucceed }) => {
        dispatch("buildCompleted", {
            buildId,
            status: didSucceed ? STATUS.succeeded : STATUS.failed,
            statusText: didSucceed ? "Build successfull" : "Build failed",
            timestamp: new Date().toISOString()
        });
    }
}



function Aggregator(data) {

    this.eventHandlers = {
        onBuildStarted: ({ buildId, status, statusText, timestamp }) => {
            data.builds[buildId] = { buildId, status, statusText, timestamp }
        },

        onBuildProgressReported: ({ buildId, status, statusText, timestamp }) => {
            data.builds[buildId] = { buildId, status, statusText, timestamp }
        },

        onBuildCompleted: ({ buildId, status, statusText, timestamp }) => {
            data.builds[buildId] = {
                buildId,
                status,
                statusText,
                isCompleted: true,
                timestamp
            };
        }

    }
}



const modelDefinition = {
    snapshotName: () => "project-details",
    initializeLogAggregatorData: () => ({ builds: {} }),
    createLogAggregator: (data) => new Aggregator(data),
    createDomainModel: (dispatch, data) => new DomainModel(dispatch, data)
}



module.exports = modelDefinition;