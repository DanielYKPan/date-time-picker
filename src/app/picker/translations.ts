/**
 * translation
 */

import { InjectionToken } from '@angular/core';

// import translations
import { LANG_DE_TRANS } from '../locale/de';
import { LANG_EN_TRANS } from '../locale/en';
import { LANG_ZHCN_TRANS } from '../locale/zh-cn';
import { LANG_ZHHK_TRANS } from '../locale/zh-hk';
import { LANG_ZHTW_TRANS } from '../locale/zh-tw';

// translation token
export const TRANSLATIONS = new InjectionToken('translations');

// all translations
export const dictionary = {
    'de': LANG_DE_TRANS,
    'en': LANG_EN_TRANS,
    'zh_CN': LANG_ZHCN_TRANS,
    'zh_HK': LANG_ZHHK_TRANS,
    'zh_TW': LANG_ZHTW_TRANS,
};

// providers
export const TRANSLATION_PROVIDERS = [
    {provide: TRANSLATIONS, useValue: dictionary},
];
