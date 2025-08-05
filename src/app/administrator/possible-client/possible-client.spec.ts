import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PossibleClient } from './possible-client';

describe('PossibleClient', () => {
  let component: PossibleClient;
  let fixture: ComponentFixture<PossibleClient>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PossibleClient]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PossibleClient);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
