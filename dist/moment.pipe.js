"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var picker_service_1 = require("./picker.service");
var MomentPipe = (function () {
    function MomentPipe(service) {
        this.service = service;
    }
    MomentPipe.prototype.transform = function (moment, format) {
        return format ? moment.locale(this.service.dtLocale).format(format) :
            moment.locale(this.service.dtLocale).format('MMM DD, YYYY');
    };
    return MomentPipe;
}());
MomentPipe.decorators = [
    { type: core_1.Pipe, args: [{
                name: 'moment'
            },] },
];
MomentPipe.ctorParameters = function () { return [
    { type: picker_service_1.PickerService, },
]; };
exports.MomentPipe = MomentPipe;
//# sourceMappingURL=moment.pipe.js.map