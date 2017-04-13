"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var de_1 = require("../locale/de");
var en_1 = require("../locale/en");
var zh_cn_1 = require("../locale/zh-cn");
var zh_hk_1 = require("../locale/zh-hk");
var zh_tw_1 = require("../locale/zh-tw");
exports.TRANSLATIONS = new core_1.InjectionToken('translations');
exports.dictionary = {
    'de': de_1.LANG_DE_TRANS,
    'en': en_1.LANG_EN_TRANS,
    'zh_CN': zh_cn_1.LANG_ZHCN_TRANS,
    'zh_HK': zh_hk_1.LANG_ZHHK_TRANS,
    'zh_TW': zh_tw_1.LANG_ZHTW_TRANS,
};
exports.TRANSLATION_PROVIDERS = [
    { provide: exports.TRANSLATIONS, useValue: exports.dictionary },
];
//# sourceMappingURL=translations.js.map