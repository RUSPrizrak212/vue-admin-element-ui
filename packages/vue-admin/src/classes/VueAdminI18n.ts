import dayjs from 'dayjs';
import { IVueAdminI18n, Map } from '@/types';
import * as I18nMessages from '../i18n';

export class VueAdminI18n implements IVueAdminI18n {
    private locale: string;

    private fallback: string;

    private messages: Map;

    public supporterLanguages = ['en', 'es', 'fr', 'ru'];

    constructor(options?: any) {
        this.locale = options?.locale ?? 'en';
        this.fallback = options?.fallback ?? 'en';
        this.messages = options?.messages ?? I18nMessages;
        dayjs.locale(this.locale);
    }

    setLocale(value: string): void {
        if (this.supporterLanguages.includes(value)) {
            this.locale = value;
            dayjs.locale(this.locale);
        } else {
            this.locale = 'en';
        }
    }

    getLocale(): string {
        return this.locale;
    }

    setFallback(value: string): void {
        this.fallback = value;
    }

    getFallback(): string {
        return this.fallback;
    }

    setMessages(messages: Map): void {
        this.messages = messages;
    }

    getMessages(): Map {
        return this.messages;
    }
}

export function createI18n(options?: any): IVueAdminI18n {
    return new VueAdminI18n(options);
}
