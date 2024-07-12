import { Injectable } from '@angular/core';
import { AbstractControl, FormControl, ValidationErrors } from '@angular/forms';


@Injectable({
    providedIn: 'root'
})

export class CustomvalidationService {

    static ValidateIdNumber(idNumber: any) {
        var tempTotal;
        var checkSum = 0;
        var multiplier = 1;

        for (let i = 0; i < 13; ++i) {
            tempTotal = parseInt(idNumber.charAt(i)) * multiplier;
            if (tempTotal > 9) {
                tempTotal = parseInt(tempTotal.toString().charAt(0)) + parseInt(tempTotal.toString().charAt(1));
            }
            checkSum = checkSum + tempTotal;
            multiplier = (multiplier % 2 === 0) ? 1 : 2;
        }

        if ((checkSum % 10) !== 0) {
            return false;
        }
        return true;
    }

    idNumberValidator(control: AbstractControl): ValidationErrors | null {
        const value = control.value;
        if (value == null || value === '') {
            return null;
        }
        const isValid = CustomvalidationService.ValidateIdNumber(value);
        return isValid ? null : { invalidIdNumber: true };
    }
}
