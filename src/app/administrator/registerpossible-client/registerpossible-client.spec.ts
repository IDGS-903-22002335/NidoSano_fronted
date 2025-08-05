import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterpossibleClient } from './registerpossible-client';

describe('RegisterpossibleClient', () => {
  let component: RegisterpossibleClient;
  let fixture: ComponentFixture<RegisterpossibleClient>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterpossibleClient]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterpossibleClient);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
