/**
 * portal.directive
 */

import {
    ComponentFactoryResolver, ComponentRef, Directive, EmbeddedViewRef, OnDestroy,
    ViewContainerRef
} from '@angular/core';
import { BasePortalHost, ComponentPortal, Portal, TemplatePortal } from './portal.class';

@Directive({
    selector: '[owlPortalHost]',
    exportAs: 'owlPortalHost',
    inputs: ['portal: owlPortalHost']
})
export class PortalHostDirective extends BasePortalHost implements OnDestroy {

    /** The attached portal. */
    private _portal: Portal<any> | null = null;
    get portal(): Portal<any> | null {
        return this._portal;
    }

    set portal( portal: Portal<any> | null ) {
        if (this.hasAttached()) {
            super.detach();
        }

        if (portal) {
            super.attach(portal);
        }

        this._portal = portal;
    }

    constructor( private componentFactoryResolver: ComponentFactoryResolver,
                 private viewContainerRef: ViewContainerRef ) {
        super();
    }

    public ngOnDestroy(): void {
        super.dispose();
        this._portal = null;
    }

    public attachComponentPortal<T>( portal: ComponentPortal<T> ): ComponentRef<T> {
        portal.setAttachedHost(this);

        const viewContainerRef = portal.viewContainerRef != null ? portal.viewContainerRef : this.viewContainerRef;

        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(portal.component);

        const ref = viewContainerRef.createComponent(
            componentFactory, viewContainerRef.length,
            portal.injector || viewContainerRef.parentInjector);

        super.setDisposeFn(() => ref.destroy());
        this._portal = portal;

        return ref;
    }

    public attachTemplatePortal<C>( portal: TemplatePortal<C> ): EmbeddedViewRef<C> {
        portal.setAttachedHost(this);
        const viewRef = this.viewContainerRef.createEmbeddedView(portal.templateRef, portal.context);
        super.setDisposeFn(() => this.viewContainerRef.clear());
        this._portal = portal;

        return viewRef;
    }
}
