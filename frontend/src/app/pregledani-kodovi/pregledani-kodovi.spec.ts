import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PregledaniKodovi } from './pregledani-kodovi';

describe('PregledaniKodovi', () => {
  let component: PregledaniKodovi;
  let fixture: ComponentFixture<PregledaniKodovi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PregledaniKodovi]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PregledaniKodovi);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
