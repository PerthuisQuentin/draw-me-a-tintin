import * as Winston from 'winston';

var Logger = new Winston.Logger({
	levels: {
		error: 0,
		warn: 1,
		info: 2,
		verbose: 3,
		debug: 4,
		data: 5,
		silly: 6
	},
	colors: {
		error: 'red',
		warn: 'yellow',
		info: 'green',
		verbose: 'cyan',
		debug: 'blue',
		data: 'magenta',
		silly: 'grey'
	},
	level: 'info',
	transports: [
		new (Winston.transports.Console)({
			name: 'debug-console',
			level: 'silly',
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

export default Logger;