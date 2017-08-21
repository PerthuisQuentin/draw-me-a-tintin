const Fs = require('fs');
const Yaml = require('js-yaml');

var environment: string = process.env.NODE_ENV || 'default';
var configFile = 'config.default.yml';

if(environment === 'production') configFile = 'config.prod.yml';
if(environment === 'development') configFile = 'config.dev.yml';

interface Config {
	server?: {
		host?: string,
		port?: number
	},
    environment?: string,
	imagesPath?: string,
	imagesList?: string,
	resourcesPath?: string,
	resourcesList?: string
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
	console.log(`Configuration ${configFile} loaded !`);
} catch (e) {
	console.log(`Can't load config file ${configFile}`, e);
	process.exit(1);
}

// Merge loadedConfig in config
configMerge(loadedConfig, config);

export default config;