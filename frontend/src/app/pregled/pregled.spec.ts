import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Pregled } from './pregled';

describe('Pregled', () => {
  let component: Pregled;
  let fixture: ComponentFixture<Pregled>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Pregled]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Pregled);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
