import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IzmeniZadatak } from './izmeni-zadatak';

describe('IzmeniZadatak', () => {
  let component: IzmeniZadatak;
  let fixture: ComponentFixture<IzmeniZadatak>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IzmeniZadatak]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IzmeniZadatak);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
