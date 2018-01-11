/**
 * injection.service
 */

import {
    ApplicationRef, ComponentFactoryResolver, ComponentRef, Injectable,
    Injector, EmbeddedViewRef, Type
} from '@angular/core';

/**
 * Injection service is a helper to append components
 * dynamically to a known location in the DOM, most
 * noteably for dialogs/tooltips appending to body.
 *
 * @export
 * @class InjectionService
 */
@Injectable()
export class InjectionService {
    private _container: ComponentRef<any>;

    constructor( private applicationRef: ApplicationRef,
                 private componentFactoryResolver: ComponentFactoryResolver,
                 private injector: Injector ) {
    }

    /**
     * Gets the root view container to inject the component to.
     *
     * @returns {ComponentRef<any>}
     *
     * @memberOf InjectionService
     */
    getRootViewContainer(): ComponentRef<any> {
        if (this._container) {
            return this._container;
        }

        const rootComponents = this.applicationRef['components'];
        if (rootComponents.length) {
            return rootComponents[0];
        }

        throw new Error('View Container not found! ngUpgrade needs to manually set this via setRootViewContainer.');
    }

    /**
     * Overrides the default root view container. This is useful for
     * things like ngUpgrade that doesn't have a ApplicationRef root.
     *
     * @param {any} container
     *
     * @memberOf InjectionService
     */
    setRootViewContainer( container: any ): void {
        this._container = container;
    }

    /**
     * Gets the html element for a component ref.
     *
     * @param {ComponentRef<any>} componentRef
     * @returns {HTMLElement}
     *
     * @memberOf InjectionService
     */
    getComponentRootNode( componentRef: ComponentRef<any> ): HTMLElement {
        return (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
    }

    /**
     * Gets the root component container html element.
     *
     * @returns {HTMLElement}
     *
     * @memberOf InjectionService
     */
    getRootViewContainerNode(): HTMLElement {
        return this.getComponentRootNode(this.getRootViewContainer());
    }

    /**
     * Projects the inputs onto the component
     *
     * @param {ComponentRef<any>} component
     * @param {*} options
     * @returns {ComponentRef<any>}
     *
     * @memberOf InjectionService
     */
    projectComponentInputs( component: ComponentRef<any>, options: any ): ComponentRef<any> {
        if (options) {
            const props = Object.getOwnPropertyNames(options);
            for (const prop of props) {
                component.instance[prop] = options[prop];
            }
        }

        return component;
    }

    /**
     * Appends a component to a adjacent location
     *
     * @template T
     * @param {Type<T>} componentClass
     * @param {*} [options={}]
     * @param {Element} [location=this.getRootViewContainerNode()]
     * @returns {ComponentRef<any>}
     *
     * @memberOf InjectionService
     */
    appendComponent<T>( componentClass: Type<T>,
                        options: any = {},
                        location: Element = this.getRootViewContainerNode() ): ComponentRef<any> {

        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(componentClass);
        const componentRef = componentFactory.create(this.injector);
        const appRef: any = this.applicationRef;
        const componentRootNode = this.getComponentRootNode(componentRef);

        // project the options passed to the component instance
        this.projectComponentInputs(componentRef, options);

        // ApplicationRef's attachView and detachView methods are in Angular ^2.2.1 but not before.
        // The `else` clause here can be removed once 2.2.1 is released.
        if (appRef['attachView']) {
            appRef.attachView(componentRef.hostView);

            // No need for this as https://angular.io/api/core/ApplicationRef
            /*componentRef.onDestroy(() => {
                appRef.detachView(componentRef.hostView);
            });*/
        }

        location.appendChild(componentRootNode);

        return componentRef;
    }
}
