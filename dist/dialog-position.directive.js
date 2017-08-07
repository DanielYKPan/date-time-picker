"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var picker_service_1 = require("./picker.service");
var DialogPositionDirective = (function () {
    function DialogPositionDirective(el, renderer, service) {
        this.el = el;
        this.renderer = renderer;
        this.service = service;
    }
    DialogPositionDirective.prototype.ngOnInit = function () {
        this.dialogPosition = this.service.dtPosition;
        this.dialogPositionOffset = this.service.dtPositionOffset;
        this.mode = this.service.dtMode;
    };
    DialogPositionDirective.prototype.ngAfterViewInit = function () {
        this.dialogHeight = this.el.nativeElement.offsetHeight;
        this.dialogWidth = this.el.nativeElement.offsetWidth;
        if (this.mode === 'dropdown') {
            this.setDropDownDialogPosition();
            this.setDialogStyle();
        }
    };
    DialogPositionDirective.prototype.setDropDownDialogPosition = function () {
        if (window.innerWidth < 768) {
            this.position = 'fixed';
            this.top = 0;
            this.left = 0;
        }
        else {
            var node = this.directiveElementRef.nativeElement;
            var position = 'static';
            var transform = void 0;
            var parentNode = null;
            var boxDirective = void 0;
            while (node !== null && node.tagName !== 'HTML') {
                position = window.getComputedStyle(node).getPropertyValue("position");
                transform = window.getComputedStyle(node).getPropertyValue("-webkit-transform");
                if (position !== 'static' && parentNode === null) {
                    parentNode = node;
                }
                if (position === 'fixed') {
                    break;
                }
                node = node.parentNode;
            }
            if (position !== 'fixed' || transform) {
                boxDirective = this.createBox(this.directiveElementRef.nativeElement, true);
                if (parentNode === null) {
                    parentNode = node;
                }
                var boxParent = this.createBox(parentNode, true);
                this.top = boxDirective.top - boxParent.top;
                this.left = boxDirective.left - boxParent.left;
            }
            else {
                boxDirective = this.createBox(this.directiveElementRef.nativeElement, false);
                this.top = boxDirective.top;
                this.left = boxDirective.left;
                this.position = 'fixed';
            }
            if (this.dialogPosition === 'left') {
                this.top += parseInt(this.dialogPositionOffset) / 100 * boxDirective.height;
                this.left -= this.dialogWidth + 3;
            }
            else if (this.dialogPosition === 'top') {
                this.top -= this.dialogHeight + 3;
                this.left += parseInt(this.dialogPositionOffset) / 100 * boxDirective.width;
            }
            else if (this.dialogPosition === 'right') {
                this.top += parseInt(this.dialogPositionOffset) / 100 * boxDirective.height;
                this.left += boxDirective.width + 3;
            }
            else {
                this.top += boxDirective.height + 3;
                this.left += parseInt(this.dialogPositionOffset) / 100 * boxDirective.width;
            }
        }
    };
    DialogPositionDirective.prototype.createBox = function (element, offset) {
        return {
            top: element.getBoundingClientRect().top + (offset ? window.pageYOffset : 0),
            left: element.getBoundingClientRect().left + (offset ? window.pageXOffset : 0),
            width: element.offsetWidth,
            height: element.offsetHeight
        };
    };
    DialogPositionDirective.prototype.setDialogStyle = function () {
        this.renderer.setStyle(this.el.nativeElement, 'top', this.top + 'px');
        this.renderer.setStyle(this.el.nativeElement, 'left', this.left + 'px');
        this.renderer.setStyle(this.el.nativeElement, 'position', this.position);
        return;
    };
    return DialogPositionDirective;
}());
DialogPositionDirective.decorators = [
    { type: core_1.Directive, args: [{
                selector: '[dialogPosition]',
            },] },
];
DialogPositionDirective.ctorParameters = function () { return [
    { type: core_1.ElementRef, },
    { type: core_1.Renderer2, },
    { type: picker_service_1.PickerService, },
]; };
DialogPositionDirective.propDecorators = {
    'directiveElementRef': [{ type: core_1.Input },],
};
exports.DialogPositionDirective = DialogPositionDirective;
//# sourceMappingURL=dialog-position.directive.js.map