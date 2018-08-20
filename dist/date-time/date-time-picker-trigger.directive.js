import { ChangeDetectorRef, Directive, HostBinding, HostListener, Input } from '@angular/core';
import { OwlDateTimeComponent } from './date-time-picker.component';
import { merge, of as observableOf, Subscription } from 'rxjs';
var OwlDateTimeTriggerDirective = (function () {
    function OwlDateTimeTriggerDirective(changeDetector) {
        this.changeDetector = changeDetector;
        this.stateChanges = Subscription.EMPTY;
    }
    Object.defineProperty(OwlDateTimeTriggerDirective.prototype, "disabled", {
        get: function () {
            return this._disabled === undefined ? this.dtPicker.disabled : !!this._disabled;
        },
        set: function (value) {
            this._disabled = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OwlDateTimeTriggerDirective.prototype, "owlDTTriggerDisabledClass", {
        get: function () {
            return this.disabled;
        },
        enumerable: true,
        configurable: true
    });
    OwlDateTimeTriggerDirective.prototype.ngOnInit = function () {
    };
    OwlDateTimeTriggerDirective.prototype.ngOnChanges = function (changes) {
        if (changes.datepicker) {
            this.watchStateChanges();
        }
    };
    OwlDateTimeTriggerDirective.prototype.ngAfterContentInit = function () {
        this.watchStateChanges();
    };
    OwlDateTimeTriggerDirective.prototype.ngOnDestroy = function () {
        this.stateChanges.unsubscribe();
    };
    OwlDateTimeTriggerDirective.prototype.handleClickOnHost = function (event) {
        if (this.dtPicker) {
            this.dtPicker.open();
            event.stopPropagation();
        }
    };
    OwlDateTimeTriggerDirective.prototype.watchStateChanges = function () {
        var _this = this;
        this.stateChanges.unsubscribe();
        var inputDisabled = this.dtPicker && this.dtPicker.dtInput ?
            this.dtPicker.dtInput.disabledChange : observableOf();
        var pickerDisabled = this.dtPicker ?
            this.dtPicker.disabledChange : observableOf();
        this.stateChanges = merge(pickerDisabled, inputDisabled)
            .subscribe(function () {
            _this.changeDetector.markForCheck();
        });
    };
    OwlDateTimeTriggerDirective.decorators = [
        { type: Directive, args: [{
                    selector: '[owlDateTimeTrigger]',
                },] },
    ];
    OwlDateTimeTriggerDirective.ctorParameters = function () { return [
        { type: ChangeDetectorRef, },
    ]; };
    OwlDateTimeTriggerDirective.propDecorators = {
        "dtPicker": [{ type: Input, args: ['owlDateTimeTrigger',] },],
        "disabled": [{ type: Input },],
        "owlDTTriggerDisabledClass": [{ type: HostBinding, args: ['class.owl-dt-trigger-disabled',] },],
        "handleClickOnHost": [{ type: HostListener, args: ['click', ['$event'],] },],
    };
    return OwlDateTimeTriggerDirective;
}());
export { OwlDateTimeTriggerDirective };
