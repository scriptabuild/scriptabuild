const path = require("path");
const { defineStore } = require("@scriptabuild/eventstore");
const systemModelDefinition = require("./systemModel");
const configuration = require("../configuration");

async function getSystemModel() {
    let systemFolder = path.resolve(configuration.systemFolder, "system-log");
    let store = await defineStore(systemFolder);
    let model = store.defineModel(systemModelDefinition);

    return model;
}

async function doesProjectExist(projectId) {
    let model = await getSystemModel();
    return model.withReadInstance(instance => !!instance.getProject({ projectId }));
}

async function ensureProject(projectId) {
    //TODO:
}

module.exports = {
    getSystemModel,
    doesProjectExist,
    ensureProject
}