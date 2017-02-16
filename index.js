"use strict";

global.rootRequire = function(name) {
    return require(__dirname + '/' + name);
}

var Commander = require('commander');

const Config = rootRequire('src/config');

var pkg = require('./package');
 
Commander
	.version(pkg.version)
	.option('-c, --config [file]', 'Select a config file')
	.parse(process.argv);
 
// Load default or specified condifugration
Config.load(Commander.config);

// Start server
rootRequire('src/server')();
