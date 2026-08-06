/**
 * dialog-ref.class
 */
import { ESCAPE } from '@angular/cdk/keycodes';
import { GlobalPositionStrategy, OverlayRef } from '@angular/cdk/overlay';
import { Location } from '@angular/common';
import { Signal, signal } from '@angular/core';
import { Observable, Subject, Subscription, SubscriptionLike, filter, take } from 'rxjs';
import { IDateTimePickerAnimationEvent } from '../date-time/date-time-picker-animation-event';
import { DialogPosition } from './dialog-config.class';
import { OwlDialogContainerComponent } from './dialog-container.component';

export class OwlDialogRef<T> {

    private result: any;

    private _beforeClose$ = new Subject<any>();

    private _beforeOpen$ = new Subject<any>();

    private _afterOpen$ = new Subject<any>();

    private _afterClosed$ = new Subject<any>();

    /** Subscription to changes in the user's location. */
    private locationChanged: SubscriptionLike = Subscription.EMPTY;

    /**
     * The instance of component opened into modal
     * */
    public componentInstance = signal<T | undefined>(undefined);

    /** Whether the user is allowed to close the dialog. */
    public disableClose = true;

    constructor(private overlayRef: OverlayRef,
        private container: OwlDialogContainerComponent,
        public readonly id: string,
        location?: Location) {
        this.disableClose = this.container.config.disableClose;

        this.container.animationStateChanged
            .pipe(
                filter(( event: IDateTimePickerAnimationEvent ) => event.phaseName === 'start' && event.toState === 'enter'),
                take(1)
            )
            .subscribe(() => {
                this._beforeOpen$.next(null);
                this._beforeOpen$.complete();
            });

        this.container.animationStateChanged
            .pipe(
                filter(( event: IDateTimePickerAnimationEvent ) => event.phaseName === 'done' && event.toState === 'enter'),
                take(1)
            )
            .subscribe(() => {
                this._afterOpen$.next(null);
                this._afterOpen$.complete();
            });

        this.container.animationStateChanged
            .pipe(
                filter((event: IDateTimePickerAnimationEvent) => event.phaseName === 'done' && event.toState === 'leave'),
                take(1)
            )
            .subscribe(() => {
                this.overlayRef.dispose();
                this.locationChanged.unsubscribe();
                this._afterClosed$.next(this.result);
                this._afterClosed$.complete();
                this.componentInstance.set(undefined);
            });

        this.overlayRef.keydownEvents()
            .pipe(filter(event => event.keyCode === ESCAPE && !this.disableClose))
            .subscribe(() => this.close());

        if (location) {
            this.locationChanged = location.subscribe(() => {
                if (this.container.config.closeOnNavigation) {
                    this.close();
                }
            });
        }
    }

    public close(dialogResult?: any) {
        this.result = dialogResult;

        this.container.animationStateChanged
            .pipe(
                filter(event => event.phaseName === 'start'),
                take(1)
            )
            .subscribe(() => {
                this._beforeClose$.next(dialogResult);
                this._beforeClose$.complete();
                this.overlayRef.detachBackdrop();
            });

        this.container.startExitAnimation();
    }

    /**
     * Gets an observable that emits when the overlay's backdrop has been clicked.
     */
    public backdropClick(): Observable<any> {
        return this.overlayRef.backdropClick();
    }

    /**
     * Gets an observable that emits when keydown events are targeted on the overlay.
     */
    public keydownEvents(): Observable<KeyboardEvent> {
        return this.overlayRef.keydownEvents();
    }

    /**
     * Updates the dialog's position.
     * @param position New dialog position.
     */
    public updatePosition(position?: DialogPosition): this {
        const strategy = this.getPositionStrategy();

        if (position && (position.left || position.right)) {
            position.left ? strategy.left(position.left) : strategy.right(position.right);
        } else {
            strategy.centerHorizontally();
        }

        if (position && (position.top || position.bottom)) {
            position.top ? strategy.top(position.top) : strategy.bottom(position.bottom);
        } else {
            strategy.centerVertically();
        }

        this.overlayRef.updatePosition();

        return this;
    }

    /**
     * Updates the dialog's width and height.
     * @param width New width of the dialog.
     * @param height New height of the dialog.
     */
    updateSize(width: string = 'auto', height: string = 'auto'): this {
        this.getPositionStrategy().width(width).height(height);
        this.overlayRef.updatePosition();
        return this;
    }

    public isAnimating(): Signal<boolean> {
        return this.container.isAnimating;
    }

    public beforeOpen(): Observable<any> {
        return this._beforeOpen$.asObservable();
    }

    public afterOpen(): Observable<any> {
        return this._afterOpen$.asObservable();
    }

    public beforeClose(): Observable<any> {
        return this._beforeClose$.asObservable();
    }

    public afterClosed(): Observable<any> {
        return this._afterClosed$.asObservable();
    }

    /** Fetches the position strategy object from the overlay ref. */
    private getPositionStrategy(): GlobalPositionStrategy {
        return this.overlayRef.getConfig().positionStrategy as GlobalPositionStrategy;
    }
}
