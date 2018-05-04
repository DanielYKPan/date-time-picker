var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Inject, InjectionToken, Input, NgZone, Optional, Output, ViewContainerRef } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ComponentPortal } from '@angular/cdk/portal';
import { Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { ESCAPE } from '@angular/cdk/keycodes';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { OwlDateTimeContainerComponent } from './date-time-picker-container.component';
import { DateTimeAdapter } from './adapter/date-time-adapter.class';
import { OWL_DATE_TIME_FORMATS } from './adapter/date-time-format.class';
import { OwlDateTime } from './date-time.class';
import { OwlDialogService } from '../dialog';
import { merge, Subscription } from 'rxjs';
import { filter, take } from 'rxjs/operators';
export var OWL_DTPICKER_SCROLL_STRATEGY = new InjectionToken('owl-dtpicker-scroll-strategy');
export function OWL_DTPICKER_SCROLL_STRATEGY_PROVIDER_FACTORY(overlay) {
    return function () { return overlay.scrollStrategies.block(); };
}
export var OWL_DTPICKER_SCROLL_STRATEGY_PROVIDER = {
    provide: OWL_DTPICKER_SCROLL_STRATEGY,
    deps: [Overlay],
    useFactory: OWL_DTPICKER_SCROLL_STRATEGY_PROVIDER_FACTORY,
};
var OwlDateTimeComponent = (function (_super) {
    __extends(OwlDateTimeComponent, _super);
    function OwlDateTimeComponent(overlay, viewContainerRef, dialogService, ngZone, changeDetector, dateTimeAdapter, scrollStrategy, dateTimeFormats, document) {
        var _this = _super.call(this, dateTimeAdapter, dateTimeFormats) || this;
        _this.overlay = overlay;
        _this.viewContainerRef = viewContainerRef;
        _this.dialogService = dialogService;
        _this.ngZone = ngZone;
        _this.changeDetector = changeDetector;
        _this.dateTimeAdapter = dateTimeAdapter;
        _this.scrollStrategy = scrollStrategy;
        _this.dateTimeFormats = dateTimeFormats;
        _this.document = document;
        _this._pickerType = 'both';
        _this._pickerMode = 'popup';
        _this._disabled = false;
        _this.afterPickerClosed = new EventEmitter();
        _this.afterPickerOpen = new EventEmitter();
        _this.confirmSelectedChange = new EventEmitter();
        _this.disabledChange = new EventEmitter();
        _this.dtInputSub = Subscription.EMPTY;
        _this.focusedElementBeforeOpen = null;
        _this._selecteds = [];
        return _this;
    }
    Object.defineProperty(OwlDateTimeComponent.prototype, "startAt", {
        get: function () {
            if (this._startAt) {
                return this._startAt;
            }
            if (this._dtInput) {
                if (this._dtInput.selectMode === 'single') {
                    return this._dtInput.value || null;
                }
                else if (this._dtInput.selectMode === 'range' ||
                    this._dtInput.selectMode === 'rangeFrom') {
                    return this._dtInput.values[0] || null;
                }
                else if (this._dtInput.selectMode === 'rangeTo') {
                    return this._dtInput.values[1] || null;
                }
            }
            else {
                return null;
            }
        },
        set: function (date) {
            this._startAt = this.getValidDate(this.dateTimeAdapter.deserialize(date));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OwlDateTimeComponent.prototype, "pickerType", {
        get: function () {
            return this._pickerType;
        },
        set: function (val) {
            if (val !== this._pickerType) {
                this._pickerType = val;
                if (this._dtInput.isInSingleMode) {
                    this._dtInput.value = this._dtInput.value;
                }
                else {
                    this._dtInput.values = this._dtInput.values;
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OwlDateTimeComponent.prototype, "pickerMode", {
        get: function () {
            return this._pickerMode;
        },
        set: function (mode) {
            if (mode === 'popup') {
                this._pickerMode = mode;
            }
            else {
                this._pickerMode = 'dialog';
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OwlDateTimeComponent.prototype, "disabled", {
        get: function () {
            return this._disabled === undefined && this._dtInput ?
                this._dtInput.disabled : !!this._disabled;
        },
        set: function (value) {
            value = coerceBooleanProperty(value);
            if (value !== this._disabled) {
                this._disabled = value;
                this.disabledChange.next(value);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OwlDateTimeComponent.prototype, "dtInput", {
        get: function () {
            return this._dtInput;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OwlDateTimeComponent.prototype, "selected", {
        get: function () {
            return this._selected;
        },
        set: function (value) {
            this._selected = value;
            this.changeDetector.markForCheck();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OwlDateTimeComponent.prototype, "selecteds", {
        get: function () {
            return this._selecteds;
        },
        set: function (values) {
            this._selecteds = values;
            this.changeDetector.markForCheck();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OwlDateTimeComponent.prototype, "minDateTime", {
        get: function () {
            return this._dtInput && this._dtInput.min;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OwlDateTimeComponent.prototype, "maxDateTime", {
        get: function () {
            return this._dtInput && this._dtInput.max;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OwlDateTimeComponent.prototype, "dateTimeFilter", {
        get: function () {
            return this._dtInput && this._dtInput.dateTimeFilter;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OwlDateTimeComponent.prototype, "selectMode", {
        get: function () {
            return this._dtInput.selectMode;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OwlDateTimeComponent.prototype, "isInSingleMode", {
        get: function () {
            return this._dtInput.isInSingleMode;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OwlDateTimeComponent.prototype, "isInRangeMode", {
        get: function () {
            return this._dtInput.isInRangeMode;
        },
        enumerable: true,
        configurable: true
    });
    OwlDateTimeComponent.prototype.ngOnInit = function () {
    };
    OwlDateTimeComponent.prototype.ngOnDestroy = function () {
        this.clean();
        this.dtInputSub.unsubscribe();
        this.disabledChange.complete();
        if (this.popupRef) {
            this.popupRef.dispose();
        }
    };
    OwlDateTimeComponent.prototype.registerInput = function (input) {
        var _this = this;
        if (this._dtInput) {
            throw Error('A Owl DateTimePicker can only be associated with a single input.');
        }
        this._dtInput = input;
        this.dtInputSub = this._dtInput.valueChange.subscribe(function (value) {
            if (Array.isArray(value)) {
                _this.selecteds = value;
            }
            else {
                _this.selected = value;
            }
        });
    };
    OwlDateTimeComponent.prototype.open = function () {
        var _this = this;
        if (this.opened || this.disabled) {
            return;
        }
        if (!this._dtInput) {
            throw Error('Attempted to open an DateTimePicker with no associated input.');
        }
        if (this.document) {
            this.focusedElementBeforeOpen = this.document.activeElement;
        }
        if (this.isInSingleMode) {
            this.selected = this._dtInput.value;
        }
        else if (this.isInRangeMode) {
            this.selecteds = this._dtInput.values;
        }
        this.pickerMode === 'dialog' ?
            this.openAsDialog() :
            this.openAsPopup();
        this.pickerContainer.picker = this;
        this.hidePickerStreamSub = this.pickerContainer.hidePickerStream
            .subscribe(function () {
            _this.close();
        });
        this.confirmSelectedStreamSub = this.pickerContainer.confirmSelectedStream
            .subscribe(function (event) {
            _this.confirmSelect(event);
        });
        this.opened = true;
    };
    OwlDateTimeComponent.prototype.select = function (date) {
        if (Array.isArray(date)) {
            this.selecteds = date.slice();
        }
        else {
            this.selected = date;
        }
        if (this.pickerMode !== 'dialog' &&
            this.pickerType === 'calendar' &&
            (this.isInSingleMode || (this.isInRangeMode && this.selecteds[0] && this.selecteds[1]))) {
            this.confirmSelect();
        }
    };
    OwlDateTimeComponent.prototype.close = function (event) {
        if (!this.opened) {
            return;
        }
        if (this.dialogRef) {
            this.dialogRef.close();
        }
        if (this.popupRef) {
            this.pickerContainer.hidePickerViaAnimation();
        }
    };
    OwlDateTimeComponent.prototype.confirmSelect = function (event) {
        if (this.isInSingleMode) {
            var selected = this.selected || this.startAt || this.dateTimeAdapter.now();
            this.confirmSelectedChange.emit(selected);
        }
        else if (this.isInRangeMode) {
            this.confirmSelectedChange.emit(this.selecteds);
        }
        this.close(event);
        return;
    };
    OwlDateTimeComponent.prototype.openAsDialog = function () {
        var _this = this;
        this.dialogRef = this.dialogService.open(OwlDateTimeContainerComponent, {
            autoFocus: false,
            paneClass: 'owl-dt-dialog',
            viewContainerRef: this.viewContainerRef,
        });
        this.pickerContainer = this.dialogRef.componentInstance;
        this.dialogRef.afterOpen().subscribe(function () { return _this.afterPickerOpen.emit(null); });
        this.dialogRef.afterClosed().subscribe(function () { return _this.clean(); });
    };
    OwlDateTimeComponent.prototype.openAsPopup = function () {
        var _this = this;
        if (!this.pickerContainerPortal) {
            this.pickerContainerPortal = new ComponentPortal(OwlDateTimeContainerComponent, this.viewContainerRef);
        }
        if (!this.popupRef) {
            this.createPopup();
        }
        if (!this.popupRef.hasAttached()) {
            var componentRef = this.popupRef.attach(this.pickerContainerPortal);
            this.pickerContainer = componentRef.instance;
            this.pickerContainer.showPickerViaAnimation();
            this.ngZone.onStable.asObservable().pipe(take(1)).subscribe(function () {
                _this.popupRef.updatePosition();
            });
        }
        merge(this.popupRef.backdropClick(), this.popupRef.detachments(), this.popupRef.keydownEvents().pipe(filter(function (event) { return event.keyCode === ESCAPE; }))).subscribe(function () { return _this.close(); });
        this.pickerContainer.animationStateChanged.subscribe(function (event) {
            if (event.phaseName === 'done' && event.toState === 'visible') {
                _this.afterPickerOpen.emit(null);
            }
            if (event.phaseName === 'done' && event.toState === 'hidden') {
                _this.clean();
            }
        });
    };
    OwlDateTimeComponent.prototype.createPopup = function () {
        var overlayConfig = new OverlayConfig({
            positionStrategy: this.createPopupPositionStrategy(),
            hasBackdrop: true,
            backdropClass: 'cdk-overlay-transparent-backdrop',
            scrollStrategy: this.scrollStrategy(),
            panelClass: 'owl-dt-popup',
        });
        this.popupRef = this.overlay.create(overlayConfig);
    };
    OwlDateTimeComponent.prototype.createPopupPositionStrategy = function () {
        var fallbackOffset = 0;
        return this.overlay.position()
            .connectedTo(this._dtInput.elementRef, { originX: 'start', originY: 'bottom' }, { overlayX: 'start', overlayY: 'top' })
            .withFallbackPosition({ originX: 'start', originY: 'top' }, { overlayX: 'start', overlayY: 'bottom' }, undefined, fallbackOffset)
            .withFallbackPosition({ originX: 'end', originY: 'bottom' }, { overlayX: 'end', overlayY: 'top' })
            .withFallbackPosition({ originX: 'end', originY: 'top' }, { overlayX: 'end', overlayY: 'bottom' }, undefined, fallbackOffset)
            .withFallbackPosition({ originX: 'start', originY: 'top' }, { overlayX: 'start', overlayY: 'bottom' }, undefined, 181)
            .withFallbackPosition({ originX: 'start', originY: 'top' }, { overlayX: 'start', overlayY: 'bottom' }, undefined, 362);
    };
    OwlDateTimeComponent.prototype.clean = function () {
        var _this = this;
        if (!this.opened) {
            return;
        }
        if (this.popupRef && this.popupRef.hasAttached()) {
            this.popupRef.detach();
        }
        if (this.pickerContainerPortal && this.pickerContainerPortal.isAttached) {
            this.pickerContainerPortal.detach();
        }
        if (this.hidePickerStreamSub) {
            this.hidePickerStreamSub.unsubscribe();
            this.hidePickerStreamSub = null;
        }
        if (this.confirmSelectedStreamSub) {
            this.confirmSelectedStreamSub.unsubscribe();
            this.confirmSelectedStreamSub = null;
        }
        if (this.dialogRef) {
            this.dialogRef.close();
            this.dialogRef = null;
        }
        var completeClose = function () {
            if (_this.opened) {
                _this.opened = false;
                _this.afterPickerClosed.emit(null);
                _this.focusedElementBeforeOpen = null;
            }
        };
        if (this.focusedElementBeforeOpen &&
            typeof this.focusedElementBeforeOpen.focus === 'function') {
            this.focusedElementBeforeOpen.focus();
            setTimeout(completeClose);
        }
        else {
            completeClose();
        }
    };
    OwlDateTimeComponent.decorators = [
        { type: Component, args: [{
                    selector: 'owl-date-time',
                    exportAs: 'owlDateTime',
                    template: "",
                    styles: [""],
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    preserveWhitespaces: false,
                },] },
    ];
    OwlDateTimeComponent.ctorParameters = function () { return [
        { type: Overlay, },
        { type: ViewContainerRef, },
        { type: OwlDialogService, },
        { type: NgZone, },
        { type: ChangeDetectorRef, },
        { type: DateTimeAdapter, decorators: [{ type: Optional },] },
        { type: undefined, decorators: [{ type: Inject, args: [OWL_DTPICKER_SCROLL_STRATEGY,] },] },
        { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [OWL_DATE_TIME_FORMATS,] },] },
        { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [DOCUMENT,] },] },
    ]; };
    OwlDateTimeComponent.propDecorators = {
        "startAt": [{ type: Input },],
        "pickerType": [{ type: Input },],
        "pickerMode": [{ type: Input },],
        "disabled": [{ type: Input },],
        "afterPickerClosed": [{ type: Output },],
        "afterPickerOpen": [{ type: Output },],
    };
    return OwlDateTimeComponent;
}(OwlDateTime));
export { OwlDateTimeComponent };
