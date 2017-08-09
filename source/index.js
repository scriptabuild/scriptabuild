var program = require('commander');

program
	.version('0.0.1')
	.option('server', 'Start Scriptabuild master server')
	// .option('agent', 'Start Scriptabuild agent')
	.option('project build', 'Build project. Default ')
	// .option('export', 'export latest build artifacts to master server')
	.parse(process.argv);

	// --server <url> or --local


if (!process.argv.slice(2).length) {
    program.outputHelp();
} else if (program.server) {
	require("./server");
} else if (program.build) {
	require("./build");
}