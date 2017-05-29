const Express = require('express');
const Morgan = require("morgan");
const BodyParser = require('body-parser');
const CookieParser = require('cookie-parser');
const Session = require('express-session');
const ExpHbs  = require('express-handlebars');
const Mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(Session);
const Passport = require('passport');
const Flash = require('connect-flash');

import Log from './logger';
import config from './config';
import setupRouter from './router';
import setupStrategy from './passport';

Mongoose.Promise = global.Promise;
Mongoose.connect(config.mongoose.connectionString)
	.then(() => {
		Log.info("Connected to the db");
	})
	.catch((err: any) => {
		Log.error("Can't connect to the db", err);
	});

export default class Server {
    private server = Express();
    private host: string;
    private port: number;

    constructor() {
        this.host = config.server.host;
        this.port = config.server.port;

        var sessionOptions = {
            secret: config.session.secret,
            resave: false,
            saveUninitialized: false,
            store: new MongoStore({ mongooseConnection: Mongoose.connection }),
            cookie: { secure: false }
        };

        if(config.environment === 'production') {
            this.server.set('trust proxy', 1)
            sessionOptions.cookie.secure = true
        }

        if(config.environment === 'development') {
            this.server.use(Morgan('dev'));
        }

        // Public files
        this.server.use('/static', Express.static('./public'));
        this.server.use('/images', Express.static(config.imagesPath));

        // Parsers
        this.server.use(CookieParser());
        this.server.use(BodyParser.json());
        this.server.use(BodyParser.urlencoded({ extended: true }));

        // Handlebars views engine
        this.server.engine('.hbs', ExpHbs({ 
            extname: '.hbs',
            defaultLayout: 'main' 
        }));
        this.server.set('view engine', '.hbs');

        // Sessions
        this.server.use(Session(sessionOptions));

        // Passeport
        setupStrategy(Passport);
        this.server.use(Passport.initialize());
        this.server.use(Passport.session());

        // Flash
        this.server.use(Flash());

        // Routes
        this.server.use('/', setupRouter(Passport));
    }

    public start(callback?: any) {
        this.server.listen(this.port, this.host, () => {
            Log.info(`Server listening on port ${this.port}.`);

            if(callback) callback();
        });
    }
}