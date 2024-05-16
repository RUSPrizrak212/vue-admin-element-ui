import { Language } from 'element-plus/es/locale';
import elEn from 'element-plus/dist/locale/en.js';
import elEs from 'element-plus/dist/locale/es.js';
import elFr from 'element-plus/dist/locale/fr.js';
import elRu from 'element-plus/dist/locale/ru.js';
import { IVueAdmin, IVueAdminConfig, IVueAdminI18n, Map } from '@/types';
import { VueAdminI18n } from './VueAdminI18n';

export default class VueAdmin implements IVueAdmin {
    private i18n: IVueAdminI18n;

    private elLocales: Map = {
        en: elEn as Language,
        es: elEs as Language,
        fr: elFr as Language,
        ru: elRu as Language,
    };

    constructor(config?: IVueAdminConfig) {
        this.i18n = config?.i18n ?? new VueAdminI18n();
    }

    setLocale(name: string): void {
        this.i18n.setLocale(name);
    }

    getLocale(): string {
        return this.i18n.getLocale();
    }

    getElLocale(): Language {
        const locale = this.i18n.getLocale();
        const fallback = this.i18n.getFallback();
        return this.elLocales[locale] ?? this.elLocales[fallback];
    }

    t(key: string, replacements: object = {}): string {
        const locale = this.i18n.getLocale();
        const fallback = this.i18n.getFallback();
        let str = this.#t(key, locale) ?? this.#t(key, fallback, key);

        Object.keys(replacements).forEach((token) => {
            const value = (replacements as any)?.[token];
            str = str.replaceAll(`{${token}}`, value);
        });

        return str;
    }

    #t(key: string, locale: string, def = '') {
        const messages = this.i18n.getMessages()[locale];
        return key.split('.').reduce((o, i) => (o ? o[i] : null), messages) ?? def;
    }
}
