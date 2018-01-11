/**
 * dialog.module
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OwlDialogService } from './dialog.service';
import { OwlDialogContainerComponent } from './dialog-container.component';
import { InjectionService } from '../utils';
import { OwlOverlayModule } from '../overlay';
import { OwlFocusModule } from '../focus-trap';

@NgModule({
    imports: [CommonModule, OwlOverlayModule, OwlFocusModule],
    exports: [],
    declarations: [
        OwlDialogContainerComponent,
    ],
    providers: [OwlDialogService, InjectionService],
    entryComponents: [
        OwlDialogContainerComponent,
    ]
})
export class OwlDialogModule {
}
