import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaMedico } from './lista-medico';

describe('ListaMedico', () => {
  let component: ListaMedico;
  let fixture: ComponentFixture<ListaMedico>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaMedico],
    }).compileComponents();

    fixture = TestBed.createComponent(ListaMedico);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
