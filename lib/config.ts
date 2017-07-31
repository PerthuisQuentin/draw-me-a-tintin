import * as Fs from 'fs';
import * as Yaml from 'js-yaml';

import Log from './logger';
import { mergeObject, setWebsiteUrl } from './utils';

var environment: string = process.env.NODE_ENV || 'default';
var configFile = 'config.default.yml';

if(environment === 'production') configFile = 'config.prod.yml';
if(environment === 'development') configFile = 'config.dev.yml';

interface IConfig {
	environment?: string,
	website?: {
		title?: string,
		url?: string
	},
	server?: {
		host?: string,
		port?: number
	},
	mongoose?: {
		connectionString?: string;
	},
	mailer?: {
		from?: string,
		service?: string,
		user?: string,
		pass?: string
	},
	imagesPath?: string,
	imagesList?: string,	
	language?: {
		locales?: string[],
		default?: string
	},
	security?: {
		sessionSecret?: string;
		passwordSaltFactor?: number;
	}
}

var config: IConfig = {
	environment: environment
};

// Load config file
var loadedConfig: IConfig = {};

try {
	loadedConfig = Yaml.safeLoad(Fs.readFileSync(configFile, 'utf8'));
	Log.info(`Configuration ${configFile} loaded !`);
} catch (err) {
	Log.error(`Can't load config file ${configFile}`, err);
	process.exit(1);
}

// Merge loadedConfig in config
var mergedConfig: IConfig = mergeObject(loadedConfig, config);

// Setup Website url in utils
setWebsiteUrl(mergedConfig.website.url);

export default mergedConfig;