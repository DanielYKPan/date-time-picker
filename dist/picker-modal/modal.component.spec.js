"use strict";
var testing_1 = require("@angular/core/testing");
var modal_component_1 = require("./modal.component");
var platform_browser_1 = require("@angular/platform-browser");
describe('ModalComponent', function () {
    var comp;
    var fixture;
    var overlayEl;
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [modal_component_1.ModalComponent]
        });
        fixture = testing_1.TestBed.createComponent(modal_component_1.ModalComponent);
        comp = fixture.componentInstance;
        overlayEl = fixture.debugElement.query(platform_browser_1.By.css('.modal-overlay'));
    });
    it('should raise onOverlayClick event when the .modal-overlay element clicked', function () {
        var modalStatus;
        comp.onOverlayClick.subscribe(function (status) { return modalStatus = status; });
        overlayEl.triggerEventHandler('click', null);
        expect(modalStatus).toBeFalsy();
    });
});

//# sourceMappingURL=modal.component.spec.js.map
