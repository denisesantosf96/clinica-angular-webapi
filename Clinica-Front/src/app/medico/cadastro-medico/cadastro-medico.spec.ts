import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroMedico } from './cadastro-medico';

describe('CadastroMedico', () => {
  let component: CadastroMedico;
  let fixture: ComponentFixture<CadastroMedico>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroMedico],
    }).compileComponents();

    fixture = TestBed.createComponent(CadastroMedico);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
