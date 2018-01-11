/**
 * portal.class
 */
import { ComponentRef, ElementRef, EmbeddedViewRef, Injector, TemplateRef, ViewContainerRef } from '@angular/core';

export interface ComponentType<T> {
    new ( ...args: any[] ): T;
}

export interface PortalHost {
    attach( portal: Portal<any> ): any;

    detach(): any;

    dispose(): any;

    hasAttached(): any;
}

export abstract class Portal<T> {
    private _attachedHost: PortalHost | null;

    public attach( host: PortalHost ): T {
        if (host == null) {
            throw Error('Must provide a portal to attach');
        }

        if (host.hasAttached()) {
            throw Error('Host already has a portal attached');
        }

        this._attachedHost = host;

        return <T>host.attach(this);
    }

    public detach(): void {
        const host = this._attachedHost;

        if (host == null) {
            throw Error('Attempting to detach a portal that is not attached to a host');
        } else {
            this._attachedHost = null;
            host.detach();
        }
    }

    /**
     * Sets the PortalHost reference without performing `attach()`. This is used directly by
     * the PortalHost when it is performing an `attach()` or `detach()`.
     */
    public setAttachedHost( host: PortalHost | null ) {
        this._attachedHost = host;
    }

    get isAttached(): boolean {
        return this._attachedHost !== null;
    }
}

export class ComponentPortal<T> extends Portal<ComponentRef<T>> {

    public component: ComponentType<T>;

    public viewContainerRef?: ViewContainerRef | null;

    public injector?: Injector | null;

    constructor( component: ComponentType<T>,
                 viewContainRef?: ViewContainerRef,
                 injector?: Injector ) {
        super();
        this.component = component;
        this.viewContainerRef = viewContainRef;
        this.injector = injector;
    }
}

export class TemplatePortal<C> extends Portal<C> {

    public templateRef: TemplateRef<C>;

    public viewContainerRef: ViewContainerRef;

    public context: C | undefined;

    constructor( template: TemplateRef<any>,
                 viewContainerRef: ViewContainerRef,
                 context?: C ) {
        super();
        this.templateRef = template;
        this.viewContainerRef = viewContainerRef;
        if (context) {
            this.context = context;
        }
    }

    get origin(): ElementRef {
        return this.templateRef.elementRef;
    }

    /**
     * Attach the the portal to the provided `PortalHost`.
     * When a context is provided it will override the `context` property of the `TemplatePortal`
     * instance.
     */
    attach( host: PortalHost, context: C | undefined = this.context ): C {
        this.context = context;
        return super.attach(host);
    }

    detach(): void {
        this.context = undefined;
        return super.detach();
    }
}

/**
 * Partial implementation of PortalHost that only deals with attaching either a
 * ComponentPortal or a TemplatePortal.
 */
export abstract class BasePortalHost implements PortalHost {
    /** The portal currently attached to the host. */
    private attachedPortal: Portal<any> | null;

    /** A function that will permanently dispose this host. */
    private disposeFn: (() => void) | null;

    /** Whether this host has already been permanently disposed. */
    private isDisposed = false;

    /** Whether this host has an attached portal. */
    public hasAttached(): boolean {
        return !!this.attachedPortal;
    }

    public attach( portal: Portal<any> ): any {
        if (!portal) {
            throw Error('Must provide a portal to attach');
        }

        if (this.hasAttached()) {
            throw Error('Host already has a portal attached');
        }

        if (this.isDisposed) {
            throw Error('This PortalHost has already been disposed');
        }

        if (portal instanceof ComponentPortal) {
            this.attachedPortal = portal;
            return this.attachComponentPortal(portal);
        } else if (portal instanceof TemplatePortal) {
            this.attachedPortal = portal;
            return this.attachTemplatePortal(portal);
        }

        throw Error('Attempting to attach an unknown Portal type. BasePortalHost accepts either ' +
            'a ComponentPortal or a TemplatePortal.');
    }

    abstract attachComponentPortal<T>( portal: ComponentPortal<T> ): ComponentRef<T>;

    abstract attachTemplatePortal<C>( portal: TemplatePortal<C> ): EmbeddedViewRef<C>;

    public detach(): void {
        if (this.attachedPortal) {
            this.attachedPortal.setAttachedHost(null);
            this.attachedPortal = null;
        }

        this.invokeDisposeFn();
    }

    public dispose() {
        if (this.hasAttached()) {
            this.detach();
        }

        this.invokeDisposeFn();
        this.isDisposed = true;
    }

    public setDisposeFn( fn: () => void ) {
        this.disposeFn = fn;
    }

    private invokeDisposeFn() {
        if (this.disposeFn) {
            this.disposeFn();
            this.disposeFn = null;
        }
    }
}
