import { MatDatepickerIntl } from '@angular/material/datepicker';

export class MeuDatepickerIntl extends MatDatepickerIntl {

  override calendarLabel = 'Calendário';

  override openCalendarLabel = 'Abrir calendário';

  override prevMonthLabel = '';

  override nextMonthLabel = '';

  override prevYearLabel = '';

  override nextYearLabel = '';

  override prevMultiYearLabel = '';

  override nextMultiYearLabel = '';
}