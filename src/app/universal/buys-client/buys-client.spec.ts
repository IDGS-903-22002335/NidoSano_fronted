import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuysClient } from './buys-client';

describe('BuysClient', () => {
  let component: BuysClient;
  let fixture: ComponentFixture<BuysClient>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuysClient]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuysClient);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
