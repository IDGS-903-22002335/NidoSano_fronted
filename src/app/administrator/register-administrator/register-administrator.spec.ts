import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterAdministrator } from './register-administrator';

describe('RegisterAdministrator', () => {
  let component: RegisterAdministrator;
  let fixture: ComponentFixture<RegisterAdministrator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterAdministrator]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterAdministrator);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
