import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Rezultat } from './rezultat';

describe('Rezultat', () => {
  let component: Rezultat;
  let fixture: ComponentFixture<Rezultat>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Rezultat]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Rezultat);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
