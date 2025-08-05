import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuysClientdetail } from './buys-clientdetail';

describe('BuysClientdetail', () => {
  let component: BuysClientdetail;
  let fixture: ComponentFixture<BuysClientdetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuysClientdetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuysClientdetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
