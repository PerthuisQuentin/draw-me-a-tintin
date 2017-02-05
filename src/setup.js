"use strict";

const Fs = require('fs');
const Path = require('path');
const Handlebars = require('handlebars');

const Log = require('src/logger');

const API_PATH = './src/api';
const API_REQUIRE_PATH = 'src/api';
const RENDER_PATH = './src/render';
const RENDER_REQUIRE_PATH = 'src/render';
const VIEWS_PATH = './src/views/html';

module.exports.register = function (server, options, next) {
	server.views({
        engines: {
            html: Handlebars
        },
        path: VIEWS_PATH,
        isCached: false
    });

    loadRouteFolder(server, {
		path: API_PATH,
		requirePath: API_REQUIRE_PATH,
		name: "API"
	});

	loadRouteFolder(server, {
		path: RENDER_PATH,
		requirePath: RENDER_REQUIRE_PATH,
		name: "RENDER"
	});

	Log.info('Routes creation completed');

	next();
};

module.exports.register.attributes = {
	name: 'setupRoutes',
	version: '1.0.0'
};

function loadRouteFolder(server, folder) {
	Fs.readdirSync(folder.path)
		.filter(file => {
			return Fs.statSync(Path.join(folder.path, file)).isDirectory();
		})
		.forEach(dir => {
			Fs.readdirSync(Path.join(folder.path, dir))
				.filter(file => {
					return Path.extname(file) === '.js';
				})
				.forEach(routeFile => {
					let route = require(Path.join(folder.requirePath, dir, routeFile));

					Log.verbose('Loaded : [' + folder.name + '][' + route.method + '] ' + route.path);

					server.route(route);
				});
		});
}