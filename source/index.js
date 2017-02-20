var program = require('commander');

program
	.version('0.0.1')
	.option('master', 'Start Scriptabuild master Server')
	.option('agent', 'Start Scriptabuild agent')
	.option('init', 'Create config.json and projects.json for the Scriptabuild server')
	.option('build', 'Build locally')
	.option('export', 'export latest build artifacts to master server')
	.parse(process.argv);

if (program.master) {
	require("./master");
} else if (program.agent) {
	require("./agent");
} else if (program.init) {
	console.log('Creating initial files...');
} else if (program.build) {
	console.log('Building locally...');
}