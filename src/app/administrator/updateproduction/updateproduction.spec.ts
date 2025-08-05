import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Updateproduction } from './updateproduction';

describe('Updateproduction', () => {
  let component: Updateproduction;
  let fixture: ComponentFixture<Updateproduction>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Updateproduction]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Updateproduction);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
