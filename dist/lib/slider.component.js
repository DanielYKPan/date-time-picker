"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var SlideControlComponent = (function () {
    function SlideControlComponent(el, renderer) {
        var _this = this;
        this.el = el;
        this.renderer = renderer;
        this.step = 1;
        this.floor = 0;
        this.ceiling = 100;
        this.precision = 0;
        this.lowChange = new core_1.EventEmitter(true);
        this.pointerHalfWidth = 0;
        this.barWidth = 0;
        this.minOffset = 0;
        this.maxOffset = 0;
        this.minValue = 0;
        this.maxValue = 0;
        this.valueRange = 0;
        this.offsetRange = 0;
        this.movePointer = function (event) {
            _this.move(event);
        };
        this.stopPointer = function () {
            _this.stop();
        };
    }
    SlideControlComponent.prototype.ngOnInit = function () {
        this.pointerHalfWidth = this.lowPointer.nativeElement.offsetWidth / 2;
        this.barWidth = this.bar.nativeElement.offsetWidth;
        this.maxOffset = this.barWidth - this.lowPointer.nativeElement.offsetWidth;
        this.minValue = this.floor;
        this.maxValue = this.ceiling;
        this.valueRange = this.maxValue - this.minValue;
        this.offsetRange = this.maxOffset - this.minOffset;
        this.setPointers();
    };
    SlideControlComponent.prototype.ngOnDestroy = function () {
        if (this.mouseMoveListener) {
            this.mouseMoveListener();
        }
        if (this.mouseUpListener) {
            this.mouseUpListener();
        }
        if (this.touchMoveListener) {
            this.touchMoveListener();
        }
        if (this.touchEndListener) {
            this.touchEndListener();
        }
    };
    SlideControlComponent.prototype.setPointers = function () {
        var lowPercentValue, lowOffsetValue;
        lowPercentValue = this.percentValue(this.low);
        lowOffsetValue = this.pixelsToOffset(lowPercentValue);
        this.renderer.setStyle(this.lowPointer.nativeElement, 'left', lowOffsetValue + 'px');
        this.renderer.setStyle(this.highlight.nativeElement, 'width', lowOffsetValue + 'px');
    };
    SlideControlComponent.prototype.start = function (event) {
        this.mouseMoveListener = this.renderer.listen('document', 'mousemove', this.movePointer);
        this.touchMoveListener = this.renderer.listen('document', 'touchmove', this.movePointer);
        this.mouseUpListener = this.renderer.listen('document', 'mouseup', this.stopPointer);
        this.touchEndListener = this.renderer.listen('document', 'touchend', this.stopPointer);
    };
    SlideControlComponent.prototype.stop = function () {
        this.mouseMoveListener();
        this.touchMoveListener();
        this.mouseUpListener();
        this.touchEndListener();
    };
    SlideControlComponent.prototype.move = function (event) {
        event.preventDefault();
        var lowOldValue = this.low;
        var newOffset = Math.max(Math.min(this.getX(event), this.maxOffset), this.minOffset);
        var newPercent = this.percentOffset(newOffset);
        var newValue = this.minValue + (this.valueRange * newPercent / 100);
        newValue = this.roundStep(newValue, this.precision, this.step, this.floor);
        this.low = newValue;
        this.setPointers();
        if (this.low !== lowOldValue) {
            this.lowChange.emit(this.low);
        }
    };
    SlideControlComponent.prototype.getX = function (event) {
        return (event.pageX !== undefined ? event.pageX : event.touches[0].pageX) - this.el.nativeElement.getBoundingClientRect().left - this.pointerHalfWidth;
    };
    SlideControlComponent.prototype.roundStep = function (value, precision, step, floor) {
        var remainder = (value - floor) % step;
        var steppedValue = remainder > (step / 2) ? value + step - remainder : value - remainder;
        var decimals = Math.pow(10, precision);
        var roundedValue = steppedValue * decimals / decimals;
        return parseFloat(roundedValue.toFixed(precision));
    };
    SlideControlComponent.prototype.contain = function (value) {
        if (isNaN(value))
            return value;
        return Math.min(Math.max(0, value), 100);
    };
    SlideControlComponent.prototype.percentValue = function (value) {
        return this.contain(((value - this.minValue) / this.valueRange) * 100);
    };
    ;
    SlideControlComponent.prototype.percentOffset = function (offset) {
        return this.contain(((offset - this.minOffset) / this.offsetRange) * 100);
    };
    ;
    SlideControlComponent.prototype.pixelsToOffset = function (percent) {
        return percent * this.offsetRange / 100;
    };
    ;
    return SlideControlComponent;
}());
SlideControlComponent.decorators = [
    { type: core_1.Component, args: [{
                selector: 'app-slide-bar',
                template: "<div class=\"bar\" [ngClass]=\"{\n    'theme-green': theme === 'green',\n    'theme-teal': theme === 'teal',\n    'theme-grape': theme === 'grape',\n    'theme-cyan': theme === 'cyan',\n    'theme-red': theme === 'red',\n    'theme-gray': theme === 'gray'}\" #bar><div class=\"highlight\" #highlight></div></div><div class=\"handle low\" #lowPointer><span>{{low}}</span></div>",
                styles: ["*,::after,::before{-moz-box-sizing:border-box;box-sizing:border-box}:host{display:block;position:relative;height:4px;width:80%;margin:10px auto 20px auto;vertical-align:middle}.bar{width:100%;height:100%;-moz-border-radius:10px;border-radius:10px;background:#ccc;overflow:hidden}.bar .highlight{position:absolute;left:0;width:0;height:100%;background:#0070ba}.handle{position:absolute;top:-10px;left:0;width:25px;height:25px;display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-moz-box-pack:center;-ms-flex-pack:center;justify-content:center;-webkit-box-align:center;-webkit-align-items:center;-moz-box-align:center;-ms-flex-align:center;align-items:center;background:#fff;-moz-box-shadow:0 0 5px #ccc;box-shadow:0 0 5px #ccc;z-index:2;-moz-border-radius:100%;border-radius:100%;cursor:pointer}.theme-green .highlight{background:#2b8a3e}.theme-teal .highlight{background:#087f5b}.theme-cyan .highlight{background:#0b7285}.theme-grape .highlight{background:#862e9c}.theme-red .highlight{background:#c92a2a}.theme-gray .highlight{background:#212529}"],
                host: {
                    '(mousedown)': 'start($event)',
                    '(touchstart)': 'start($event)'
                }
            },] },
];
SlideControlComponent.ctorParameters = function () { return [
    { type: core_1.ElementRef, },
    { type: core_1.Renderer2, },
]; };
SlideControlComponent.propDecorators = {
    'step': [{ type: core_1.Input },],
    'floor': [{ type: core_1.Input },],
    'ceiling': [{ type: core_1.Input },],
    'precision': [{ type: core_1.Input },],
    'low': [{ type: core_1.Input },],
    'theme': [{ type: core_1.Input },],
    'lowChange': [{ type: core_1.Output },],
    'bar': [{ type: core_1.ViewChild, args: ['bar',] },],
    'highlight': [{ type: core_1.ViewChild, args: ['highlight',] },],
    'lowPointer': [{ type: core_1.ViewChild, args: ['lowPointer',] },],
};
exports.SlideControlComponent = SlideControlComponent;
//# sourceMappingURL=slider.component.js.map