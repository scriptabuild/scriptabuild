const path = require("path");
const { defineStore } = require("@scriptabuild/eventstore");
const systemModelDefinition = require("./systemModel");
const configuration = require("../configuration");
const { folder } = require("../fs-utils");


async function ensureFolder() {
    let systemFolder = path.resolve(configuration.systemFolder, "system-log");
    await folder(systemFolder).ensure();
}

async function getSystemModel() {
    let systemFolder = path.resolve(configuration.systemFolder, "system-log");
    let store = defineStore(systemFolder);
    let model = store.defineModel(systemModelDefinition);

    return model;
}

async function doesProjectExist(projectId) {
    let model = await getSystemModel();
    return await model.withReadInstance(instance => !!instance.getProject( projectId ));
}

async function doesProjectExistMiddleware(req, resp, next){
    let projectId = req.params.projectId;
    if (!await doesProjectExist(projectId)) {
        resp.sendStatus(404);
        return;
    }

    await next();
}

async function ensureProject(projectId) {
    await ensureFolder();
    let model = await getSystemModel();
    await model.withReadWriteInstance((instance, readyToCommit) => {
        if(instance.getProject(projectId)){
            // project exists
            return;
        }
        instance.setProject(projectId, {name: projectId, id: projectId});
        readyToCommit();
    });
}

module.exports = {
    getSystemModel,
    // ensureFolder,
    // doesProjectExist,
    doesProjectExistMiddleware,
    ensureProject
}