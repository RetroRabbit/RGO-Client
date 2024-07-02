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

    if (end >= start) {
        control.get(startDateKey)?.setErrors(null);
        control.get(endDateKey)?.setErrors(null);
        return null;
    }
    else {
        control.get(startDateKey)?.setErrors({'incorrect': true});
        control.get(endDateKey)?.setErrors({'incorrect': true});
        return { endDateAfterStartDate: true }
    }
  };
}

