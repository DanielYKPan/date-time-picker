/**
 * modal.component.spec
 */

import { TestBed, ComponentFixture } from "@angular/core/testing";
import { ModalComponent } from "./modal.component";
import { DebugElement } from "@angular/core";
import { By } from "@angular/platform-browser";

describe('ModalComponent', () => {

    let comp:    ModalComponent;
    let fixture: ComponentFixture<ModalComponent>;
    let overlayEl: DebugElement;

   beforeEach(() => {
       TestBed.configureTestingModule({
           declarations: [ModalComponent]
       });

       fixture = TestBed.createComponent(ModalComponent);

       comp = fixture.componentInstance; // ModalComponent test instance

       overlayEl  = fixture.debugElement.query(By.css('.modal-overlay'));

   });

   it('should raise onOverlayClick event when the .modal-overlay element clicked', () => {
       let modalStatus: boolean;
       comp.onOverlayClick.subscribe((status: boolean) => modalStatus = status);
       overlayEl.triggerEventHandler('click', null);
       expect(modalStatus).toBeFalsy();
   });
});
