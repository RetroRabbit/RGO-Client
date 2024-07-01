import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function endDateAfterStartDateValidator(startDateKey: string, endDateKey: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const startDate = control.get(startDateKey)?.value;
    const endDate = control.get(endDateKey)?.value;

    if (!startDate || !endDate) {
        return null;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    return end >= start ? null : { endDateAfterStartDate: true };
  };
}

