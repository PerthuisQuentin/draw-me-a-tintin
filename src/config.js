"use strict";

const Fs = require('fs');
const Yaml = require('js-yaml');

var config;

try {
  	config = Yaml.safeLoad(Fs.readFileSync('config.yml', 'utf8'));
} catch (e) {
  	console.log("Can't load config.yml\n", e);
  	process.exit(1);
}

module.exports = config;