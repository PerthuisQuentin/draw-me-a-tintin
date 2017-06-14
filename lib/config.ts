const Fs = require('fs');
const Yaml = require('js-yaml');

import Log from './logger';

var environment: string = process.env.NODE_ENV || 'default';
var configFile = 'config.default.yml';

if(environment === 'production') configFile = 'config.prod.yml';
if(environment === 'development') configFile = 'config.dev.yml';

interface Config {
	website?: {
		title: string
	},
	server?: {
		host?: string,
		port?: number
	},
	session?: {
        secret?: string;
    },
	mongoose?: {
        connectionString?: string;
    },
	languages?: string[],
    environment?: string,
	imagesPath?: string,
	imagesList?: string
}

// Add or overwrite config elements in source to target
function configMerge(source: any, target: any) {
	for(let key in source) {
		if(source[key].constructor.name !== 'Object') {
			target[key] = source[key];
		} else {
			if(!target[key]) target[key] = {};
			configMerge(source[key], target[key]);
		}
	}
}

var config: Config = {
    environment: environment
};

// Load config file
var loadedConfig: object = {};

try {
	loadedConfig = Yaml.safeLoad(Fs.readFileSync(configFile, 'utf8'));
	Log.info(`Configuration ${configFile} loaded !`);
} catch (err) {
	Log.error(`Can't load config file ${configFile}`, err);
	process.exit(1);
}

// Merge loadedConfig in config
configMerge(loadedConfig, config);

export default config;