const Fs = require('fs');
const Moment = require('moment');

import config from './config';

var images = JSON.parse(Fs.readFileSync(config.imagesList));

images = images.sort((imageA: any, imageB: any) => {
	let dateA = Moment(imageA.date, 'DD/MM/YYYY');
	let dateB = Moment(imageB.date, 'DD/MM/YYYY');

	if(dateA.isSame(dateB)) return 0;
	else if(dateA.isAfter(dateB)) return -1;
	else return 1;
});

export default images;