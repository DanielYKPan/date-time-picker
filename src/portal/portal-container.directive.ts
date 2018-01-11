/**
 * portal-container.directive
 */


import {
    ComponentFactoryResolver, ComponentRef, Directive, EventEmitter, Injector, OnDestroy, Output,
    ViewContainerRef
} from '@angular/core';
import { ComponentType } from './portal.class';

@Directive({
    selector: '[owlPortalContainer]',
    exportAs: 'owlPortalContainer',
    inputs: ['portal: owlPortalContainer']
})
export class PortalContainerDirective implements OnDestroy {

    @Output() containerAttached = new EventEmitter<any>();

    @Output() containerDestroyed = new EventEmitter<any>();

    constructor( private componentFactoryResolver: ComponentFactoryResolver,
                 private viewContainerRef: ViewContainerRef,
                 private injector: Injector ) {
    }

    public ngOnDestroy(): void {
    }

    public attachContainer( containerComponent: ComponentType<any> ): ComponentRef<any> {
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(containerComponent);
        const ref = this.viewContainerRef.createComponent(
            componentFactory,
            this.viewContainerRef.length,
            this.viewContainerRef.parentInjector || this.injector
        );
        this.containerAttached.emit(null);

        ref.onDestroy(() => {
            this.containerDestroyed.emit(null);
        });

        return ref;
    }
}

