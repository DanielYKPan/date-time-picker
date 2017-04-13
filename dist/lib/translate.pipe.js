"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var translate_service_1 = require("./translate.service");
var TranslatePipe = (function () {
    function TranslatePipe(translate) {
        this.translate = translate;
    }
    TranslatePipe.prototype.transform = function (value, args) {
        if (!value) {
            return;
        }
        return this.translate.instant(value);
    };
    return TranslatePipe;
}());
TranslatePipe.decorators = [
    { type: core_1.Pipe, args: [{
                name: 'translate'
            },] },
];
TranslatePipe.ctorParameters = function () { return [
    { type: translate_service_1.TranslateService, },
]; };
exports.TranslatePipe = TranslatePipe;
//# sourceMappingURL=translate.pipe.js.map