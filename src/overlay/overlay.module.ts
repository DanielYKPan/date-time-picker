/**
 * overlay.module
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OwlOverlayComponent } from './overlay.component';
import { InjectionService } from '../utils';
import { PortalModule } from '../portal';
import { OwlOverlayPaneComponent } from './overlay-pane.component';

@NgModule({
    imports: [CommonModule, PortalModule],
    exports: [OwlOverlayComponent, PortalModule],
    declarations: [OwlOverlayComponent, OwlOverlayPaneComponent],
    providers: [InjectionService],
    entryComponents: [OwlOverlayComponent, OwlOverlayPaneComponent]
})
export class OwlOverlayModule {
}
