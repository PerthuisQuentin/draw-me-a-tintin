import * as Crypto from 'crypto';
import * as Joi from 'joi';

export function capitalize(word: string): string {
	return word.charAt(0).toUpperCase() + word.slice(1);
}

// Merge multiple strings in one without space and capitalize each words (camelCase)
export function mergeInCamelCase(...words: string[]): string {
	
	if(!words.length) 
		return '';
	if(words.length === 1) 
		return words[0];

	var result: string = words[0];

	for(var i = 1; i < words.length; i++) {
		result += capitalize(words[i]);
	}

	return result;
}

// Return first element of accepted present in searchIn
export function findFirstMatch<T>(searchIn: T[], accepted: T[]): T {

	var firstFound: T;

	accepted.some((element: T) : boolean => {
		if(searchIn.includes(element)) {
			firstFound = element;
			return true;
		}

		return false;
	});
	
	return firstFound;
}

export class CustomError extends Error {
	public isCustomError = true;
	public type = 'custom';
}

export class HttpError extends CustomError {
	public isCustomError = false;
	public isHttpError = true;
	public type = 'http';
    public statusCode: number;
	public data: any;
	
	constructor(statusCode: number, message: string, data?: any) {
        super(message);

		this.statusCode = statusCode;
		this.data = data;

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, HttpError.prototype);
    }

	public static badRequest(data?: any): HttpError {
		return new HttpError(400, 'badRequest', data);
    }

	public static internalError(data?: any): HttpError {
		return new HttpError(500, 'internalError', data);
    }

	public static databaseError(data?: any): HttpError {
		return new HttpError(503, 'databaseError', data);
    }

}

export class DataError extends CustomError {
	public isCustomError = false;
	public isDataError = true;
	public type = 'data';
	public data: any;

	constructor(message: string, data: any) {
        super(message);

		this.data = data;

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, DataError.prototype);
    }
}

export interface IJoiError {
	[error: string]: any;
}

// Transform a Joi Error in a string
export function parseJoiError(err: Joi.ValidationError): IJoiError {

	if(!err.isJoi)
		return null;

	var result: IJoiError = {};

	for(var detail of err.details) {

		var name = detail.context.key;
		var type = detail.type.split('.')[1];
		var value;

		var error = mergeInCamelCase(name, type);

		switch(type) { 
			case 'min':
			case 'max':
				value = detail.context.limit;
				break; 
		} 
		
		result[error] = value ? value : name;
	}

	return result;
}

// Flatten an object 
export function flattenObject(datas: any): any {
	let newDatas: any = {};

	for(let key in datas) {
		if(typeof datas[key] == 'object') {
			let flattened: any = flattenObject(datas[key]);

			for(let subKey in flattened) {
				newDatas[key + '.' + subKey] = flattened[subKey];
			}
		} else {
			newDatas[key] = datas[key];
		}
	}

	return newDatas;
}

// Add or overwrite elements in source to target by recursion
function mergeObject_r(source: any, target: any): any {
	for(let key in source) {
		if(source[key].constructor.name !== 'Object') {
			target[key] = source[key];
		} else {
			if(!target[key]) target[key] = {};
			mergeObject(source[key], target[key]);
		}
	}
}

// Add or overwrite elements in source to target
export function mergeObject(source: any, target: any): any {
	mergeObject_r(source, target);
	return target;
}


export function generateToken(): string {
	return Crypto.randomBytes(64).toString('hex');
}

// Can't take it directly from config because config need utils
var webSiteRoot: string;

export function setWebsiteUrl(url: string) {
	webSiteRoot = url;

	if(!webSiteRoot.endsWith('/'))
		webSiteRoot += '/';
}

export function websitePathJoin(...path: string[]): string {
	let websitePath = webSiteRoot;
	
	for(var i = 0; i < path.length - 1; i++) {
		websitePath += path[i] + '/';
	}

	return websitePath + path[path.length - 1];
}