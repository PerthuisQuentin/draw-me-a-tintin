import { get } from './i18n';

export function I18n(id: string, data?: any): string {

	if(typeof data != 'object') 
		return get(this.locale, id, data);

	return get(this.locale, id);
}

export function IfCond(v1: any, v2: any, options: any) {

	console.log(typeof v1)
	console.log(typeof v2)
	console.log(v1 === v2)
	console.log(options)

	if(v1 === v2)
		return options.fn(this);
	
	return options.inverse(this);
}