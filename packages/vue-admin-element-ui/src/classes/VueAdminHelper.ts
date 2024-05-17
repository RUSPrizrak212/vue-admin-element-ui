import dayjs from 'dayjs';
import localeData from 'dayjs/plugin/localeData';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import weekday from 'dayjs/plugin/weekday';
import duration from 'dayjs/plugin/duration';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import 'dayjs/locale/ru';
import 'dayjs/locale/es';
import 'dayjs/locale/fr';
import scrollParent from 'scrollparent';
import { IVueAdmin, IVueAdminHelper, IVueAdminHelperFormatPriceConfig } from '@/types';

dayjs.extend(localeData);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(weekday);
dayjs.extend(duration);
dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

export default class VueAdminHelper implements IVueAdminHelper {
    private vueAdmin: IVueAdmin;

    constructor(vueAdmin: IVueAdmin) {
        this.vueAdmin = vueAdmin;
    }

    formatPrice(number: number, currency: string, config?: IVueAdminHelperFormatPriceConfig): string {
        const locale = this.vueAdmin.getLocale();
        let result = number;

        const params = {
            divide: 1,
            ...config,
        };

        const options: any = {
            currency,
            minimumFractionDigits: 0,
        };
        if (config?.showCurrency) {
            options.style = 'currency';
        }

        result /= params.divide;

        if (!config?.showDecimal) {
            options.maximumFractionDigits = 0;
        }
        if (config?.wrapCurrency) {
            return new Intl.NumberFormat(locale, options)
                .formatToParts(result)
                .map(({ type, value }) => {
                    if (type === 'currency') {
                        return `<span class="currency">${value}</span>`;
                    }
                    return value;
                })
                .reduce((string, part) => string + part);
        }

        return new Intl.NumberFormat(locale, options).format(result);
    }

    formatUnit(number: any, unit: string): string {
        const locale = this.vueAdmin.getLocale();
        const options = { unit, style: 'unit' };

        return new Intl.NumberFormat(locale, options).format(number);
    }

    /* eslint-disable-next-line class-methods-use-this */
    formatDate(value: any): string {
        return dayjs(value).format('LLL');
    }

    /* eslint-disable-next-line class-methods-use-this */
    toNow(value: any): string {
        return dayjs(value).fromNow();
    }

    /* eslint-disable-next-line class-methods-use-this */
    onlyDate(value: any): string {
        return dayjs(value).format('LL');
    }

    /* eslint-disable-next-line class-methods-use-this */
    onlyTime(value: any): string {
        return dayjs(value).format('HH:mm A');
    }

    /* eslint-disable-next-line class-methods-use-this */
    onlyMonthYear(value: any): string {
        return dayjs(value).format('MMMM YYYY');
    }

    /* eslint-disable-next-line class-methods-use-this */
    duration(value: any): string {
        return dayjs.duration(value * 1000).format('mm:ss');
    }

    validateDate(dateStr: string): string {
        let date = dayjs(dateStr);
        const year = date.year();
        if (year > 9999) {
            date = date.year(9999);
        } else if (year < 1000) {
            date = date.year(1000);
        }

        return date.format('YYYY-MM-DD');
    }

    /* eslint-disable-next-line class-methods-use-this */
    bottomIsOutOfSight(element: HTMLElement | SVGElement) {
        const parentElementWithScroll = scrollParent(element);
        const elementBounds = element.getBoundingClientRect();
        const maxHeight = elementBounds.y + elementBounds.height;
        if (parentElementWithScroll && parentElementWithScroll.clientHeight < maxHeight) {
            /* eslint-disable-next-line max-len */
            element.style.cssText = `top:${elementBounds.height * -1}px;margin-top:${
                parseInt(getComputedStyle(element).marginTop, 10) * -1 - 3
            }px;`;
            return;
        }
        element.style.cssText = '';
    }

    /* eslint-disable-next-line class-methods-use-this */
    ucfirst(value: string): string {
        return value.charAt(0).toUpperCase() + value.slice(1);
    }
}
