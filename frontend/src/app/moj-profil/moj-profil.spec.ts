import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MojProfil } from './moj-profil';

describe('MojProfil', () => {
  let component: MojProfil;
  let fixture: ComponentFixture<MojProfil>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MojProfil]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MojProfil);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
