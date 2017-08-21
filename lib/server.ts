const Express = require('express');
const BodyParser = require('body-parser');
const ExpHbs  = require('express-handlebars');
const Favicon = require('serve-favicon');

import Log from './logger';
import config from './config';
import router from './router';

export default class Server {
    private server = Express();
    private host: string;
    private port: number;

    constructor() {
        this.host = config.server.host;
        this.port = config.server.port;

		// Favicon
		this.server.use(Favicon('./public/favicon.ico'));

        // Public files
        this.server.use('/static', Express.static('./public'));
        this.server.use('/images', Express.static(config.imagesPath));
        this.server.use('/resources', Express.static(config.resourcesPath));

        // Parsers
        this.server.use(BodyParser.json({ type: 'application/*+json' }));

        // Handlebars views engine
        this.server.engine('.hbs', ExpHbs({ 
            extname: '.hbs' 
        }));
        this.server.set('view engine', '.hbs');

        // Routes
        this.server.use('/', router);
    }

    public start(callback?: any) {
        this.server.listen(this.port, this.host, () => {
            Log.info(`Server listening on port ${this.port}.`);

            if(callback) callback();
        });
    }
}