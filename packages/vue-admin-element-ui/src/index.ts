import './index.css';
import VueClickAwayPlugin from 'vue3-click-away';
import type { App } from 'vue';
import Errors from './classes/Errors';

import { IVueAdminConfig } from './types';
import VueAdminHelper from './classes/VueAdminHelper';
import VueAdmin from './classes/VueAdmin';
import { createI18n } from './classes/VueAdminI18n';

export function VueAdminPlugin(app: App, config?: IVueAdminConfig) {
    const vueAdmin = new VueAdmin(config);

    app.config.globalProperties.$vueAdmin = vueAdmin;

    app.config.globalProperties.$vueAdminHelper = new VueAdminHelper(vueAdmin);

    app.use(VueClickAwayPlugin);
}

export { createI18n, Errors };

export * from './components';
