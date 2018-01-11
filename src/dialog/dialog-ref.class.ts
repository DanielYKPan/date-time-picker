/**
 * dialog-ref.class
 */
import { AnimationEvent } from '@angular/animations';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { OwlDialogContainerComponent } from './dialog-container.component';
import { ComponentRef } from '@angular/core';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/first';

export class OwlDialogRef<T> {

    private result: any;

    private _beforeClose$ = new Subject<any>();
    private _beforeClose = this._beforeClose$.asObservable();

    private _afterOpen$ = new Subject<any>();
    private _afterOpen = this._afterOpen$.asObservable();

    private _afterClosed$ = new Subject<any>();
    private _afterClosed = this._afterClosed$.asObservable();

    /**
     * The instance of component opened into modal
     * */
    public componentInstance: T;

    /** Whether the user is allowed to close the dialog. */
    public disableClose = this.containerRef.instance.config.disableClose;

    private container: OwlDialogContainerComponent;

    constructor( public containerRef: ComponentRef<OwlDialogContainerComponent>,
                 public readonly id: string ) {

        this.container = containerRef.instance;

        Observable.from(this.container.animationStateChanged)
            .filter(( event: AnimationEvent ) => event.phaseName === 'done' && event.toState === 'enter')
            .first()
            .subscribe(() => {
                this._afterOpen$.next();
                this._afterOpen$.complete();
            });

        Observable.from(this.container.animationStateChanged)
            .filter(( event: AnimationEvent ) => event.phaseName === 'done' && event.toState === 'exit')
            .first()
            .subscribe(() => {
                this._afterClosed$.next(this.result);
                this._afterClosed$.complete();
                this.componentInstance = null;
            });
    }

    public close( dialogResult?: any ) {
        this.result = dialogResult;

        Observable.from(this.container.animationStateChanged)
            .filter(( event: AnimationEvent ) => event.phaseName === 'start')
            .first()
            .subscribe(() => {
                this._beforeClose$.next(dialogResult);
                this._beforeClose$.complete();
            });

        this.container.startExitAnimation();
    }

    public isAnimating(): boolean {
        return this.container.isAnimating;
    }

    public afterOpen(): Observable<any> {
        return this._afterOpen;
    }

    public beforeClose(): Observable<any> {
        return this._beforeClose;
    }

    public afterClosed(): Observable<any> {
        return this._afterClosed;
    }
}
