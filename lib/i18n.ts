import * as Fs from 'fs';
import * as Path from 'path';
import * as Yaml from 'js-yaml';
import * as Express from 'express';

import Log from './logger';
import config from './config';
import { 
	findFirstMatch,
	flattenObject
} from './utils';

interface Ii18nOptions {
	directory?: string,
	locales?: string[],
	defaultLocale?: string
}

var directory: string = './locales';
var locales: string[] = ['en'];
var defaultLocale: string = 'en';
var localesDatas: any = {};

export function configure(options: Ii18nOptions): void {
	if(options.directory)
		directory = options.directory;

	if(options.locales)
		locales = options.locales;

	if(options.defaultLocale)
		defaultLocale = options.defaultLocale;

	checkFiles();
	loadLocales();
}

export function init(request: Express.Request, response: Express.Response, next: Express.NextFunction): void {
	guessLanguage(request);
	
	next();
}

export function get(locale: string, id: string, data?: any): string {
	var text: string = localesDatas[locale][id];

	if(!text)
		Log.error("[I18n] Can't find '" + id + "'");

	if(data) {
		if(data instanceof Array) {
			var i: number = 0;

			while(text.includes('%s')) {
				if(data.length == i) break;

				text = text.replace(/%s/, data[i]);
				i++;
			}
		} 
		else if(typeof data != 'object') {
			console.log('Héhé');
			text = text.replace(/%s/g, data);
		}
	}

	return text;
}

function guessLanguage(request: Express.Request): void {

	// Skip if language already defined
	if(request.locale) return;

	let acceptsLanguages: string[] = request.acceptsLanguages();

	// #1 Check user's language
	if(request.session.user && request.session.user.language) {
		request.locale = request.session.user.language;
		return;
	}

	// #2 Check accepted languages
	if(acceptsLanguages) {
		let firstFound: string = findFirstMatch<string>(config.language.locales, acceptsLanguages);

		if(firstFound) {
			request.locale = firstFound;
			return;
		}
	}

	// #3 Take default language
	request.locale = config.language.default;
}

function checkFiles(): void {
	if(!Fs.existsSync(directory)) {
		Fs.mkdirSync(directory);
	}

	for(let locale of locales) {
		let file = Path.join(directory, locale + '.yml');

		if(!Fs.existsSync(file)) {
			Fs.writeFileSync(file, '# ' + locale);
		}
	}
}

function loadLocales(): void {
	for(let locale of locales) {
		let file: string = Path.join(directory, locale + '.yml');
		let datas: any;

		try {
			datas = Yaml.safeLoad(Fs.readFileSync(file, 'utf8'));
			localesDatas[locale] = flattenObject(datas);
		} catch (err) {
			Log.error('Can\'t load locale file', err);
			process.exit(1);
		}
	}
}