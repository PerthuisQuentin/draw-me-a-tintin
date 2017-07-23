import * as Express from 'express';
import * as Morgan from 'morgan';
import * as BodyParser from 'body-parser';
import * as CookieParser from 'cookie-parser';
import * as Session from 'express-session';
import * as ExpHbs from 'express-handlebars';
import * as Mongoose from 'mongoose';
import * as ConnectMongo from 'connect-mongo';
import * as Passport from 'passport';
import { Promise } from 'ts-promise';
var Flash = require('connect-flash');

import Log from './logger';
import config from './config';
import setupRouter from './router';
import setupStrategy from './passport';
import * as hbsHelpers from './helpers';
import * as I18n from './i18n';

var MongoStore = ConnectMongo(Session);

(<any>Mongoose).Promise = Promise;

Mongoose.connect(config.mongoose.connectionString, {
	useMongoClient: true
})
	.then(() => {
		Log.info('Connected to the db');
	})
	.catch((err: any) => {
		Log.error('Can\'t connect to the db', err);
	});

export default class Server {
	private server: Express.Application = Express();
	private host: string;
	private port: number;

	constructor() {
		this.host = config.server.host;
		this.port = config.server.port;

		var sessionOptions = {
			secret: config.security.sessionSecret,
			resave: false,
			saveUninitialized: false,
			store: new MongoStore({ mongooseConnection: Mongoose.connection }),
			cookie: { secure: false }
		};

		if(config.environment === 'production') {
			this.server.set('trust proxy', 1);
			sessionOptions.cookie.secure = true;
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
			defaultLayout: 'main',
			helpers: hbsHelpers
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

		// I18n
		I18n.configure({
			directory: './locales',
			locales: config.language.locales,
			defaultLocale: config.language.default
		});
		this.server.use(I18n.init);

		this.server.use(function(a, b, c) {
			console.log(a.xhr);
			c();
		})

		// Routes
		this.server.use('/', setupRouter(Passport));
	}

	public start(callback?: any): void {
		this.server.listen(this.port, this.host, () => {
			Log.info('Server listening on port', this.port);

			if(callback) callback();
		});
	}
}