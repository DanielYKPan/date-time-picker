/**
 * focus-trap.module
 */

import { NgModule } from '@angular/core';

import { OwlFocusTrapDirective } from './focus-trap.directive';
import { InteractivityChecker } from './interactivity-checker';
import { Platform } from './platform';

@NgModule({
    imports: [],
    exports: [OwlFocusTrapDirective],
    declarations: [OwlFocusTrapDirective],
    providers: [InteractivityChecker, Platform],
})
export class OwlFocusModule {
}
