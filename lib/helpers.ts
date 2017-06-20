import { get } from './i18n';

export function I18n(id: any) {
	return get(this.locale, id);
}