import { MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

export const APP_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

export const APP_DATE_PROVIDER = [
  {
    provide: MAT_DATE_FORMATS,
    useValue: APP_DATE_FORMATS,
  },
  {
    provide: MAT_DATE_LOCALE,
    useValue: 'pt-BR',
  }
];