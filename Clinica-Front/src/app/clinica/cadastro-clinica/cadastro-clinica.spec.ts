import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroClinica } from './cadastro-clinica';

describe('CadastroClinica', () => {
  let component: CadastroClinica;
  let fixture: ComponentFixture<CadastroClinica>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroClinica],
    }).compileComponents();

    fixture = TestBed.createComponent(CadastroClinica);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
