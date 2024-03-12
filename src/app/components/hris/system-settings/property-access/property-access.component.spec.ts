import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyAccessComponent } from './property-access.component';

describe('PropertyAccessCodeComponent', () => {
    let component: PropertyAccessComponent;
    let fixture: ComponentFixture<PropertyAccessComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [PropertyAccessComponent]
        });
        fixture = TestBed.createComponent(PropertyAccessComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});