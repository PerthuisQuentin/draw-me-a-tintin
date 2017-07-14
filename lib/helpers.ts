import { get } from './i18n';

export function I18n(id: string): string {
	return get(this.locale, id);
}