/**
 * slider.component.spec
 */

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SlideControlComponent } from "./slider.component";
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { PickerService } from './picker.service';

describe('SlideControlComponent', () => {

    let fixture: ComponentFixture<SlideControlComponent>;
    let comp: SlideControlComponent;
    let expectedLowNum: number;
    let lowPointerDe: DebugElement;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SlideControlComponent],
            providers: [PickerService]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SlideControlComponent);

        comp = fixture.componentInstance;

        lowPointerDe = fixture.debugElement.query(By.css('.low'));

        expectedLowNum = 10;

        comp.low = expectedLowNum;
        comp.ceiling = 100;

        fixture.detectChanges();
    });

    it('should display low number', () => {
        expect(lowPointerDe.nativeElement.textContent).toContain(expectedLowNum, 'display low number');
    });

    it('should trigger "start" func when mousedown on the host element', () => {
        spyOn(comp, 'start');
        const hostEl = fixture.debugElement;
        hostEl.triggerEventHandler('mousedown', null);
        expect(comp.start).toHaveBeenCalled();
    });

/*    it('should raise lowChange event when mouse move', () => {
        fixture.detectChanges();
        let lowChangedValue: number;
        comp.lowChange.subscribe(( low: number ) => lowChangedValue = low);
        const hostEl = fixture.debugElement;
        hostEl.triggerEventHandler('mousedown', null);
        let event =new MouseEvent('mousemove');
        document.dispatchEvent(event);
        expect(lowChangedValue).not.toBeNaN();
    })*/
});
