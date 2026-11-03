import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResiZadatak } from './resi-zadatak';

describe('ResiZadatak', () => {
  let component: ResiZadatak;
  let fixture: ComponentFixture<ResiZadatak>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResiZadatak]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResiZadatak);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
