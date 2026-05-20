import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaEspecialidade } from './lista-especialidade';

describe('ListaEspecialidade', () => {
  let component: ListaEspecialidade;
  let fixture: ComponentFixture<ListaEspecialidade>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaEspecialidade],
    }).compileComponents();

    fixture = TestBed.createComponent(ListaEspecialidade);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
