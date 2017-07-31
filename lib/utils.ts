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

export class HttpError extends Error {
    public statusCode: number;
	
	constructor(statusCode: number, message: string) {
        super(message);

		this.statusCode = statusCode;

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, HttpError.prototype);
    }

	public static internalError(): HttpError {
		return new HttpError(500, 'internalError');
    }

	public static databaseError(): HttpError {
		return new HttpError(503, 'databaseError');
    }

}

export interface IJoiErrorStringified {
	[error: string]: any;
}

// Transform a Joi Error in a string
export function joiErrorStringify(err: Joi.ValidationError): IJoiErrorStringified {

	if(!err.isJoi)
		return null;

	var result: IJoiErrorStringified = {};

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
		
		if(value) {
			result[error] = value;
		} else {
			result[error] = name;
		}
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