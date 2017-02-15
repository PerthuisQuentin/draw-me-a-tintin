"use strict";

// Load modules

const Fs = require('fs');
const Yaml = require('js-yaml');



module.exports.config = {};

// Load the configuration from an yml file. (Default : 'config.yml')
module.exports.load = function(file) {

	if(!file) file = 'config.yml';

	try {
  		exports.config = Yaml.safeLoad(Fs.readFileSync(file, 'utf8'));
  		console.log(`Configuration ${file} loaded !`);
	} catch (e) {
	  	console.log(`Can't load config file ${file}\n`, e);
	  	process.exit(1);
	}
};