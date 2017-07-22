// Type definitions for draw-me-a-tintin
// Project: https://github.com/PerthuisQuentin/Draw-me-a-Tintin
// Definitions by: Quentin Perthuis <https://github.com/PerthuisQuentin/>

import { Promise as TSPromise } from 'ts-promise';

// Use Bluebird promises for Mongoose
declare module 'mongoose' {
	type Promise<T> = TSPromise<T>;
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