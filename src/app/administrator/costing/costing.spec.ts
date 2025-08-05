import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Costing } from './costing';

describe('Costing', () => {
  let component: Costing;
  let fixture: ComponentFixture<Costing>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Costing]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Costing);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
