"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var translations_1 = require("./translations");
var TranslateService = (function () {
    function TranslateService(translations) {
        this.translations = translations;
        this.defaultLang = 'en';
        this.fallback = true;
    }
    Object.defineProperty(TranslateService.prototype, "CurrentLang", {
        get: function () {
            return this.currentLang || this.defaultLang;
        },
        enumerable: true,
        configurable: true
    });
    TranslateService.prototype.use = function (lang) {
        this.currentLang = lang;
    };
    TranslateService.prototype.instant = function (key) {
        return this.translate(key);
    };
    TranslateService.prototype.setDefaultLang = function (lang) {
        this.defaultLang = lang;
    };
    TranslateService.prototype.enableFallback = function (enable) {
        this.fallback = enable;
    };
    TranslateService.prototype.translate = function (key) {
        var translation = key;
        if (this.translations[this.currentLang] && this.translations[this.currentLang][key]) {
            return this.translations[this.currentLang][key];
        }
        if (!this.fallback) {
            return translation;
        }
        if (this.translations[this.defaultLang] && this.translations[this.defaultLang][key]) {
            return this.translations[this.defaultLang][key];
        }
        return translation;
    };
    return TranslateService;
}());
TranslateService.decorators = [
    { type: core_1.Injectable },
];
TranslateService.ctorParameters = function () { return [
    { type: undefined, decorators: [{ type: core_1.Inject, args: [translations_1.TRANSLATIONS,] },] },
]; };
exports.TranslateService = TranslateService;
//# sourceMappingURL=translate.service.js.map