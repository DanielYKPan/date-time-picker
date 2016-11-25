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
var ModalComponent = (function () {
    function ModalComponent() {
        this.onOverlayClick = new core_1.EventEmitter();
    }
    ModalComponent.prototype.ngOnInit = function () {
    };
    ModalComponent.prototype.closeModal = function () {
        this.onOverlayClick.emit(false);
    };
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], ModalComponent.prototype, "onOverlayClick", void 0);
    ModalComponent = __decorate([
        core_1.Component({
            selector: 'picker-modal',
            template: "<section class=\"modal\"><section class=\"modal-overlay\" (click)=\"closeModal()\"></section><section class=\"modal-main\"><ng-content></ng-content></section></section>",
            styles: [".modal,.modal-overlay{position:fixed;top:0;left:0;width:100%;height:100%}:host{z-index:9999999999}*,::after,::before{-moz-box-sizing:border-box;box-sizing:border-box}.modal{z-index:99;overflow-y:scroll}.modal-overlay{z-index:11;display:block;background-color:rgba(0,0,0,.3)}.modal-main{position:absolute;top:30px;right:auto;bottom:auto;left:50%;z-index:111;background-color:#fff;border:1px solid #d7dad7;-moz-border-radius:6px;border-radius:6px;-webkit-transform:translate(-50%,0);-moz-transform:translate(-50%,0);-ms-transform:translate(-50%,0);transform:translate(-50%,0);-moz-box-shadow:0 5px 15px rgba(0,0,0,.3);box-shadow:0 5px 15px rgba(0,0,0,.3)}"],
        }), 
        __metadata('design:paramtypes', [])
    ], ModalComponent);
    return ModalComponent;
}());
exports.ModalComponent = ModalComponent;

//# sourceMappingURL=modal.component.js.map
