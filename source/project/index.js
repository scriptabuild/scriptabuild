const path = require("path");
const { defineStore } = require("@scriptabuild/eventstore");
const projectModelDefinition = require("./projectModel");
const configuration = require("../configuration");
const { folder } = require("../fs-utils");

function getProjectLogFolder(projectId) {
    let projectFolder = path.resolve(configuration.systemFolder, "projects", projectId, "project-log");
    return projectFolder;
}

async function ensureProjectLogFolder(projectId) {
    let projectFolder = getProjectLogFolder(projectId);
    await folder(projectFolder).ensure();
}

function getProjectModel(projectId) {
    let projectFolder = getProjectLogFolder(projectId);
    let store = defineStore(projectFolder);
    let model = store.defineModel(projectModelDefinition);

    return model;
}



module.exports = {
    ensureProjectLogFolder,
    getProjectModel
};