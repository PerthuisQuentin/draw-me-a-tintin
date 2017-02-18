"use strict";

// Load modules

const Fs = require('fs');
const Moment = require('moment');

const Config = rootRequire('src/config').config;



var images = JSON.parse(Fs.readFileSync(Config.paths.imageList));

images = images.sort((imageA, imageB) => {
	let dateA = Moment(imageA.date, "DD/MM/YYYY");
	let dateB = Moment(imageB.date, "DD/MM/YYYY");

	if(dateA.isSame(dateB)) return 0;
	else if(dateA.isAfter(dateB)) return -1;
	else return 1;
});

module.exports = images;