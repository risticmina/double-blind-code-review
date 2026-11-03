import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaZahteva } from './lista-zahteva';

describe('ListaZahteva', () => {
  let component: ListaZahteva;
  let fixture: ComponentFixture<ListaZahteva>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaZahteva]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaZahteva);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
