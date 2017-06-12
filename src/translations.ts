/**
 * translation
 */

import { InjectionToken } from '@angular/core';

// import translations
import { LANG_CA_TRANS } from './locale/ca';
import { LANG_DE_TRANS } from './locale/de';
import { LANG_EN_TRANS } from './locale/en';
import { LANG_ES_TRANS } from './locale/es';
import { LANG_FR_TRANS } from './locale/fr';
import { LANG_LT_TRANS } from './locale/lt';
import { LANG_PL_TRANS } from './locale/pl';
import { LANG_PT_TRANS } from './locale/pt';
import { LANG_RO_TRANS } from './locale/ro';
import { LANG_RU_TRANS } from './locale/ru';
import { LANG_ZHCN_TRANS } from './locale/zh-cn';
import { LANG_ZHHK_TRANS } from './locale/zh-hk';
import { LANG_ZHTW_TRANS } from './locale/zh-tw';

// translation token
export const TRANSLATIONS = new InjectionToken('translations');

// all translations
export const dictionary = {
    'ca': LANG_CA_TRANS,
    'de': LANG_DE_TRANS,
    'en': LANG_EN_TRANS,
    'es': LANG_ES_TRANS,
    'fr': LANG_FR_TRANS,
    'lt': LANG_LT_TRANS,
    'pl': LANG_PL_TRANS,
    'pt': LANG_PT_TRANS,
    'ro': LANG_RO_TRANS,
    'ru': LANG_RU_TRANS,
    'zh_CN': LANG_ZHCN_TRANS,
    'zh_HK': LANG_ZHHK_TRANS,
    'zh_TW': LANG_ZHTW_TRANS,
};

// providers
export const TRANSLATION_PROVIDERS = [
    {provide: TRANSLATIONS, useValue: dictionary},
];
