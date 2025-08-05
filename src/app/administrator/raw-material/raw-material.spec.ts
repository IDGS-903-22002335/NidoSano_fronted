import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RawMaterial } from './raw-material';

describe('RawMaterial', () => {
  let component: RawMaterial;
  let fixture: ComponentFixture<RawMaterial>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RawMaterial]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RawMaterial);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
