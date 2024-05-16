import { Language } from 'element-plus/es/locale';
import Errors from '../classes/Errors';

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $vueAdmin: IVueAdmin;
        $vueAdminHelper: IVueAdminHelper;
    }
}

export interface IVueAdmin {
    setLocale(name: string): void;

    getLocale(): string;

    getElLocale(): Language;

    t(key: string, replacements?: Map): string;
}

export interface IVueAdminHelper {
    formatUnit(number: any, unit: string): string;

    formatDate(value: any): string;

    toNow(value: any): string;

    onlyDate(value: any): string;

    onlyTime(value: any): string;

    onlyMonthYear(value: any): string;

    duration(value: any): string;

    bottomIsOutOfSight(element: any): void;

    ucfirst(value: string): string;

    validateDate(dateStr: string): string;
}

export interface IEntityController {
    total(): number;

    nextPage(): number | null;

    items(): Array<Map>;

    getItems(params: Map): Promise<any>;

    form(): IEntityForm | null;
}

export interface IEntityForm {
    errors(): Errors;

    title(edit: boolean): string;

    item(): Map | null;

    resetItem(): Promise<void>;

    getItem(id: number | string): Promise<void>;

    validate(field: string, data: Map): Promise<void>;

    createItem(data: Map): Promise<void>;

    updateItem(data: Map): Promise<void>;

    deleteItem(id: number | string): Promise<void>;
}

export interface IVueAdminI18n {
    setLocale(value: string): void;

    getLocale(): string;

    setFallback(value: string): void;

    getFallback(): string;

    setMessages(messages: Map): void;

    getMessages(): Map;
}

export type IVueAdminConfig = {
    i18n: IVueAdminI18n;
};

export type IVueAdminHelperFormatPriceConfig = {
    showCurrency: boolean;
    showDecimal: boolean;
    wrapCurrency: boolean;
};

export type Map = {
    [key: string]: any;
};

export type ExternalLink = {
    externalLink: string;
    toNewTab: boolean;
};

export type MenuItem = {
    title: string;
    svg?: string;
    to?: XOR<{ name: string }, ExternalLink>;
    children?: MenuItem[];
};

export type XOR<T1, T2> =
    | (T1 & { [k in Exclude<keyof T2, keyof T1>]?: never })
    | (T2 & { [k in Exclude<keyof T1, keyof T2>]?: never });
