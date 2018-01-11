/**
 * portal.module
 */

import { NgModule } from '@angular/core';
import { PortalContainerDirective } from './portal-container.directive';
import { PortalHostDirective } from './portal-host.directive';

@NgModule({
    imports: [],
    exports: [PortalContainerDirective, PortalHostDirective],
    declarations: [PortalContainerDirective, PortalHostDirective],
    providers: [],
})
export class PortalModule {
}
