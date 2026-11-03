import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DodajZadatak } from './dodaj-zadatak';

describe('DodajZadatak', () => {
  let component: DodajZadatak;
  let fixture: ComponentFixture<DodajZadatak>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DodajZadatak]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DodajZadatak);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
