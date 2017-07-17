"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
exports.SLIDER_VALUE_ACCESSOR = {
    provide: forms_1.NG_VALUE_ACCESSOR,
    useExisting: core_1.forwardRef(function () { return SlideControlComponent; }),
    multi: true
};
var SlideControlComponent = (function () {
    function SlideControlComponent(renderer) {
        this.renderer = renderer;
        this.min = 0;
        this.max = 100;
        this.isDragging = false;
        this.value = 0;
        this.onModelChange = function () {
        };
        this.onModelTouched = function () {
        };
    }
    SlideControlComponent.prototype.ngOnInit = function () {
    };
    SlideControlComponent.prototype.ngOnDestroy = function () {
        this.dragListener();
        this.mouseUpListener();
    };
    SlideControlComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.dragListener = this.renderer.listen('document', 'mousemove', function (event) {
            if (_this.isDragging) {
                _this.handleChange(event);
            }
        });
        this.mouseUpListener = this.renderer.listen('document', 'mouseup', function (event) {
            if (_this.isDragging) {
                _this.isDragging = false;
            }
        });
    };
    SlideControlComponent.prototype.onMouseDown = function (event) {
        this.isDragging = true;
        this.updateSliderData();
        event.preventDefault();
    };
    SlideControlComponent.prototype.onTouchStart = function (event) {
        var touchObj = event.changedTouches[0];
        this.startHandleValue = this.handleValue;
        this.isDragging = true;
        this.startY = parseInt(touchObj.clientY, 10);
        this.sliderHeight = this.sliderElm.nativeElement.offsetHeight;
        event.preventDefault();
    };
    SlideControlComponent.prototype.onTouchMove = function (event) {
        var touchObj = event.changedTouches[0];
        var handleValue;
        handleValue = Math.floor(((this.startY - parseInt(touchObj.clientY, 10)) * 100) / (this.sliderHeight)) + this.startHandleValue;
        this.setValueFromHandle(event, handleValue);
        event.preventDefault();
    };
    SlideControlComponent.prototype.updateSliderData = function () {
        var rect = this.sliderElm.nativeElement.getBoundingClientRect();
        this.initY = rect.top + this.getWindowScrollTop();
        this.sliderHeight = this.sliderElm.nativeElement.offsetHeight;
        return;
    };
    SlideControlComponent.prototype.writeValue = function (value) {
        if (value !== this.value) {
            this.updateValue(value);
            this.updateHandleValue();
        }
    };
    SlideControlComponent.prototype.registerOnChange = function (fn) {
        this.onModelChange = fn;
    };
    SlideControlComponent.prototype.registerOnTouched = function (fn) {
        this.onModelTouched = fn;
    };
    SlideControlComponent.prototype.setDisabledState = function (isDisabled) {
    };
    SlideControlComponent.prototype.handleChange = function (event) {
        var handleValue = this.calculateHandleValue(event);
        this.setValueFromHandle(event, handleValue);
        return;
    };
    SlideControlComponent.prototype.calculateHandleValue = function (event) {
        return Math.floor(((this.initY + this.sliderHeight) - event.pageY) * 100 / (this.sliderHeight));
    };
    SlideControlComponent.prototype.setValueFromHandle = function (event, handleValue) {
        var newValue = this.getValueFromHandle(handleValue);
        this.handleValue = handleValue;
        this.updateValue(newValue, event);
        return;
    };
    SlideControlComponent.prototype.getValueFromHandle = function (handleValue) {
        return (this.max - this.min) * (handleValue / 100) + this.min;
    };
    SlideControlComponent.prototype.updateHandleValue = function () {
        if (this.value < this.min) {
            this.handleValue = 0;
        }
        else if (this.value > this.max) {
            this.handleValue = 100;
        }
        else {
            this.handleValue = (this.value - this.min) * 100 / (this.max - this.min);
        }
        return;
    };
    SlideControlComponent.prototype.updateValue = function (val, event) {
        if (val < this.min) {
            val = this.min;
            this.handleValue = 0;
        }
        else if (val > this.max) {
            val = this.max;
            this.handleValue = 100;
        }
        this.value = Math.floor(val);
        this.onModelChange(this.value);
    };
    SlideControlComponent.prototype.getWindowScrollTop = function () {
        var doc = document.documentElement;
        return (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
    };
    return SlideControlComponent;
}());
SlideControlComponent.decorators = [
    { type: core_1.Component, args: [{
                selector: 'app-slide-bar',
                template: "<div class=\"owl-time-slider\" [ngStyle]=\"style\" #slider><span class=\"owl-time-slider-bar\" [ngStyle]=\"{'height':handleValue + '%'}\"></span> <span class=\"owl-time-slider-handle\" [ngStyle]=\"{'bottom':handleValue + '%'}\" (mousedown)=\"onMouseDown($event)\" (touchstart)=\"onTouchStart($event)\" (touchmove)=\"onTouchMove($event)\" (touchend)=\"isDragging=false\">{{value}}</span></div>",
                styles: [".owl-time-slider{position:relative;height:100%;width:4px;-moz-border-radius:10px;border-radius:10px;margin:0 auto;cursor:default;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.owl-time-slider-bar{position:absolute;bottom:0;width:100%;height:0;-moz-border-radius:10px;border-radius:10px}.owl-time-slider-handle{position:absolute;left:-23px;margin-bottom:-12.5px;width:50px;height:25px;display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-moz-box-pack:center;-ms-flex-pack:center;justify-content:center;-webkit-box-align:center;-webkit-align-items:center;-moz-box-align:center;-ms-flex-align:center;align-items:center;-moz-box-shadow:0 0 5px #ccc;box-shadow:0 0 5px #ccc;z-index:2;-moz-border-radius:20px;border-radius:20px;cursor:pointer}"],
                providers: [exports.SLIDER_VALUE_ACCESSOR],
            },] },
];
SlideControlComponent.ctorParameters = function () { return [
    { type: core_1.Renderer2, },
]; };
SlideControlComponent.propDecorators = {
    'min': [{ type: core_1.Input },],
    'max': [{ type: core_1.Input },],
    'style': [{ type: core_1.Input },],
    'sliderElm': [{ type: core_1.ViewChild, args: ['slider',] },],
};
exports.SlideControlComponent = SlideControlComponent;
//# sourceMappingURL=slider.component.js.map