import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class ValidationService {
  constructor() {}

  validateIdNumber(control: AbstractControl): ValidationErrors | null {
    const idNumber = control.value;

    if (!idNumber) {
      return null;
    }

    let tempTotal;
    let checkSum = 0;
    let multiplier = 1;

    for (let i = 0; i < 13; ++i) {
      tempTotal = parseInt(idNumber.charAt(i), 10) * multiplier;
      if (tempTotal > 9) {
        tempTotal =
          parseInt(tempTotal.toString().charAt(0), 10) +
          parseInt(tempTotal.toString().charAt(1), 10);
      }
      checkSum = checkSum + tempTotal;
      multiplier = multiplier % 2 === 0 ? 1 : 2;
    }

    return checkSum % 10 === 0 ? null : { idNumberInvalid: true };
  }
}
