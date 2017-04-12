/**
 * slider.component.spec
 */

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SlideControlComponent } from "./slider.component";
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('SlideControlComponent', () => {

    let fixture: ComponentFixture<SlideControlComponent>;
    let comp: SlideControlComponent;
    let expectedLowNum: number;
    let lowPointerDe: DebugElement;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SlideControlComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SlideControlComponent);

        comp = fixture.componentInstance;

        lowPointerDe = fixture.debugElement.query(By.css('.low'));

        expectedLowNum = 10;

        comp.low = expectedLowNum;

        fixture.detectChanges();
    });

    it('should display low number', () => {
        expect(lowPointerDe.nativeElement.textContent).toContain(expectedLowNum, 'display low number');
    });
});
