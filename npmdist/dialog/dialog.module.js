var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { A11yModule } from '@angular/cdk/a11y';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { OWL_DIALOG_SCROLL_STRATEGY_PROVIDER, OwlDialogService } from './dialog.service';
import { OwlDialogContainerComponent } from './dialog-container.component';
var OwlDialogModule = (function () {
    function OwlDialogModule() {
    }
    OwlDialogModule = __decorate([
        NgModule({
            imports: [CommonModule, A11yModule, OverlayModule, PortalModule],
            exports: [],
            declarations: [
                OwlDialogContainerComponent,
            ],
            providers: [
                OWL_DIALOG_SCROLL_STRATEGY_PROVIDER,
                OwlDialogService,
            ],
            entryComponents: [
                OwlDialogContainerComponent,
            ]
        })
    ], OwlDialogModule);
    return OwlDialogModule;
}());
export { OwlDialogModule };
