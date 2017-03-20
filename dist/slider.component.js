"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
        this.listenerMove = function (event) {
            _this.move(event);
        };
        this.listenerStop = function () {
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
    SlideControlComponent.prototype.setPointers = function () {
        var lowPercentValue, lowOffsetValue;
        lowPercentValue = this.percentValue(this.low);
        lowOffsetValue = this.pixelsToOffset(lowPercentValue);
        this.renderer.setElementStyle(this.lowPointer.nativeElement, 'left', lowOffsetValue + 'px');
        this.renderer.setElementStyle(this.highlight.nativeElement, 'width', lowOffsetValue + 'px');
    };
    SlideControlComponent.prototype.start = function (event) {
        document.addEventListener('mousemove', this.listenerMove);
        document.addEventListener('touchmove', this.listenerMove);
        document.addEventListener('mouseup', this.listenerStop);
        document.addEventListener('touchend', this.listenerStop);
    };
    SlideControlComponent.prototype.stop = function () {
        document.removeEventListener('mousemove', this.listenerMove);
        document.removeEventListener('touchmove', this.listenerMove);
        document.removeEventListener('mouseup', this.listenerStop);
        document.removeEventListener('touchend', this.listenerStop);
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
__decorate([
    core_1.Input(),
    __metadata("design:type", Number)
], SlideControlComponent.prototype, "step", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Number)
], SlideControlComponent.prototype, "floor", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Number)
], SlideControlComponent.prototype, "ceiling", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Number)
], SlideControlComponent.prototype, "precision", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Number)
], SlideControlComponent.prototype, "low", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], SlideControlComponent.prototype, "lowChange", void 0);
__decorate([
    core_1.ViewChild('bar'),
    __metadata("design:type", core_1.ElementRef)
], SlideControlComponent.prototype, "bar", void 0);
__decorate([
    core_1.ViewChild('highlight'),
    __metadata("design:type", core_1.ElementRef)
], SlideControlComponent.prototype, "highlight", void 0);
__decorate([
    core_1.ViewChild('lowPointer'),
    __metadata("design:type", core_1.ElementRef)
], SlideControlComponent.prototype, "lowPointer", void 0);
SlideControlComponent = __decorate([
    core_1.Component({
        selector: 'app-slide-bar',
        template: "<div class=\"bar\" #bar><div class=\"highlight\" #highlight></div></div><div class=\"handle low\" #lowPointer><span>{{low}}</span></div>",
        styles: [":host{display:block;position:relative;height:4px;width:80%;margin:10px auto 25px auto;vertical-align:middle}.bar{width:100%;height:100%;-moz-border-radius:10px;border-radius:10px;background:#ccc;overflow:hidden}.bar .highlight{position:absolute;left:0;width:0;height:100%;background:#4285f4}.handle{position:absolute;top:-10px;left:0;width:25px;height:25px;display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-moz-box-pack:center;-ms-flex-pack:center;justify-content:center;-webkit-box-align:center;-webkit-align-items:center;-moz-box-align:center;-ms-flex-align:center;align-items:center;background:#fff;-moz-box-shadow:0 0 5px #ccc;box-shadow:0 0 5px #ccc;z-index:2;-moz-border-radius:100%;border-radius:100%;cursor:pointer}"],
        host: {
            '(mousedown)': 'start($event)',
            '(touchstart)': 'start($event)'
        }
    }),
    __metadata("design:paramtypes", [core_1.ElementRef,
        core_1.Renderer])
], SlideControlComponent);
exports.SlideControlComponent = SlideControlComponent;

//# sourceMappingURL=slider.component.js.map
