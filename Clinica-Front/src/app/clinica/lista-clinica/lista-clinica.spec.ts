import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaClinica } from './lista-clinica';

describe('ListaClinica', () => {
  let component: ListaClinica;
  let fixture: ComponentFixture<ListaClinica>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaClinica],
    }).compileComponents();

    fixture = TestBed.createComponent(ListaClinica);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
