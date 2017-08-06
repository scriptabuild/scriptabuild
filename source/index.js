var program = require('commander');

program
	.version('0.0.1')
	.option('server', 'Start Scriptabuild master server')
	.option('agent', 'Start Scriptabuild agent')
	.option('init', 'Create config.json and projects.json for the Scriptabuild server')
	.option('build', 'Build locally')
	.option('export', 'export latest build artifacts to master server')
	.parse(process.argv);

if (!process.argv.slice(2).length) {
    program.outputHelp();
} else if (program.server) {
	require("./server");
} else if (program.agent) {
	require("./agent");
} else if (program.init) {
	require("./init");
} else if (program.build) {
	require("./build");
}