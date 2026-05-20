import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroEspecialidade } from './cadastro-especialidade';

describe('CadastroEspecialidade', () => {
  let component: CadastroEspecialidade;
  let fixture: ComponentFixture<CadastroEspecialidade>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroEspecialidade],
    }).compileComponents();

    fixture = TestBed.createComponent(CadastroEspecialidade);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
