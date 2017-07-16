// Type definitions for draw-me-a-tintin
// Project: https://github.com/PerthuisQuentin/Draw-me-a-Tintin
// Definitions by: Quentin Perthuis <https://github.com/PerthuisQuentin/>

import * as Bluebird from 'bluebird';

// Use Bluebird promises for Mongoose
declare module 'mongoose' {
	type Promise<T> = Bluebird<T>;
	interface ConnectionOptions {
		useMongoClient: boolean
	}
}

// Add specific variables to requests
declare module 'express' {
	interface Request {
		locale?: string,
		locals?: any
	}
}