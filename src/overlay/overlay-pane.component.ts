/**
 * overlay-pane.component
 */

import {
    ChangeDetectionStrategy, ChangeDetectorRef, Component, ComponentRef, ElementRef, EmbeddedViewRef,
    OnDestroy, OnInit, ViewChild
} from '@angular/core';
import { ComponentPortal, TemplatePortal, PortalHostDirective } from '../portal';

@Component({
    moduleId: module.id,
    selector: 'owl-overlay-pane',
    templateUrl: './overlay-pane.component.html',
    styleUrls: ['./overlay-pane.component.scss'],
    preserveWhitespaces: false,
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class OwlOverlayPaneComponent implements OnInit, OnDestroy {

    @ViewChild(PortalHostDirective) portalHost: PortalHostDirective;

    @ViewChild('pane') paneElm: ElementRef;

    private _overlayPaneStyle: any;
    get overlayPaneStyle() {
        return this._overlayPaneStyle;
    }

    set overlayPaneStyle( val: any ) {
        this._overlayPaneStyle = val;
        this.cdRef.markForCheck();
    }

    get pane(): HTMLElement {
        return this.paneElm.nativeElement;
    }

    constructor( private cdRef: ChangeDetectorRef ) {
    }

    public ngOnInit() {
    }

    public ngOnDestroy(): void {
        if (this.portalHost) {
            this.portalHost.detach();
        }
    }

    public attachComponentPortal<C>( portal: ComponentPortal<C> ): ComponentRef<C> {
        if (this.portalHost) {
            return this.portalHost.attachComponentPortal(portal);
        } else {
            return null;
        }
    }

    public attachTemplatePortal<C>( portal: TemplatePortal<C> ): EmbeddedViewRef<C> {
        if (this.portalHost) {
            return this.portalHost.attachTemplatePortal(portal);
        } else {
            return null;
        }
    }
}
