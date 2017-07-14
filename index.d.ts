// Type definitions for draw-me-a-tintin
// Project: https://github.com/PerthuisQuentin/Draw-me-a-Tintin
// Definitions by: Quentin Perthuis <https://github.com/PerthuisQuentin/>

import * as Bluebird from 'bluebird';

// Use Bluebird promises for Mongoose
declare module 'mongoose' {
	type Promise<T> = Bluebird<T>;
}

declare namespace Express {
	export interface Request {
		locale?: string,
		locals?: any
	}
}