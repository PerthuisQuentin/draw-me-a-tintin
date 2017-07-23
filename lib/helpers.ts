import { get } from './i18n';

export function I18n(id: string, data?: any): string {

	if(typeof data != 'object') 
		return get(this.locale, id, data);

	return get(this.locale, id);
}