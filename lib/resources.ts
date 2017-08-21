"use strict";

// Load modules

const Fs = require('fs');
const Moment = require('moment');

import config from './config';



var resources = JSON.parse(Fs.readFileSync(config.resourcesList));

resources = resources.sort((imageA: any, imageB: any) => {
	let dateA = Moment(imageA.date, "DD/MM/YYYY");
	let dateB = Moment(imageB.date, "DD/MM/YYYY");

	if(dateA.isSame(dateB)) return 0;
	else if(dateA.isAfter(dateB)) return -1;
	else return 1;
});

export default resources;