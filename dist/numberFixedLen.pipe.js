"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var NumberFixedLenPipe = (function () {
    function NumberFixedLenPipe() {
    }
    NumberFixedLenPipe.prototype.transform = function (num, len) {
        num = Math.floor(num);
        len = Math.floor(len);
        if (isNaN(num) || isNaN(len)) {
            return num.toString();
        }
        var numString = num.toString();
        while (numString.length < len) {
            numString = '0' + numString;
        }
        return numString;
    };
    return NumberFixedLenPipe;
}());
NumberFixedLenPipe.decorators = [
    { type: core_1.Pipe, args: [{
                name: 'numberFixedLen'
            },] },
];
NumberFixedLenPipe.ctorParameters = function () { return []; };
exports.NumberFixedLenPipe = NumberFixedLenPipe;
//# sourceMappingURL=numberFixedLen.pipe.js.map