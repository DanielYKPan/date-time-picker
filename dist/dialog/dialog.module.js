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
    OwlDialogModule.decorators = [
        { type: NgModule, args: [{
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
                },] },
    ];
    return OwlDialogModule;
}());
export { OwlDialogModule };
