"use strict";

const Winston = require('winston');

const Config = require('src/config.js');

var logger = new Winston.Logger({
    levels: Config.winston.levels,
  	colors: Config.winston.colors,
  	level: 'info',
    transports: [
	    new (Winston.transports.Console)({
	    	name: 'debug-console',
	    	level: Config.logsLevel.console,
	    	colorize: true,
	    	timestamp: true,
	    	showLevel: true,
	    	prettyPrint: true
	    }),
	    new (Winston.transports.File)({
      		name: 'error-file',
      		filename: 'filelog-error.log',
      		level: 'error',
      		timestamp: true,
      		showLevel: true
    	})
	]
});

module.exports = logger;