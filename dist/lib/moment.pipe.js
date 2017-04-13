"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var MomentPipe = (function () {
    function MomentPipe() {
    }
    MomentPipe.prototype.transform = function (moment, format) {
        return format ? moment.format(format) : moment.format('MMM DD, YYYY');
    };
    return MomentPipe;
}());
MomentPipe.decorators = [
    { type: core_1.Pipe, args: [{
                name: 'moment'
            },] },
];
MomentPipe.ctorParameters = function () { return []; };
exports.MomentPipe = MomentPipe;
//# sourceMappingURL=moment.pipe.js.map