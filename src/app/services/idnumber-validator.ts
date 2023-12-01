import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';


@Injectable({
    providedIn: 'root'
})
export class CustomvalidationService {

    static validateSaID(validID: FormControl): { [valtype: string]: boolean } | null {
        let idnumber = validID.value
        var invalid = 0;

        if (isNaN(idnumber)) {

            invalid++;
        }

        if (idnumber.length != 13) {

            invalid++;
        }

        var yy = idnumber.substring(0, 2),
            mm = idnumber.substring(2, 4),
            dd = idnumber.substring(4, 6);

        var dob = new Date(yy, (mm - 1), dd);


        if (!(((dob.getFullYear() + '').substring(2, 4) == yy) && (dob.getMonth() == mm - 1) && (dob.getDate() == dd))) {

            invalid++;
        }

        var gender = parseInt(idnumber.substring(6, 10), 10) > 5000 ? "M" : "F";


        if (idnumber.substring(10, 11) > 1) {

            invalid++;
        } else {

            var saffer = parseInt(idnumber.substring(10, 11), 10) === 0 ? "C" : "F";
        }

        if (idnumber.substring(11, 12) < 8) {

            invalid++;
        }

        var ncheck = 0,
            beven = false;

        for (var c = idnumber.length - 1; c >= 0; c--) {
            var cdigit = idnumber.charAt(c),
                ndigit = parseInt(cdigit, 10);

            if (beven) {
                if ((ndigit *= 2) > 9) ndigit -= 9;
            }

            ncheck += ndigit;
            beven = !beven;
        }

        if ((ncheck % 10) !== 0) {

            invalid++;
        }


        if (invalid > 0) {

            return { 'InvalidsaID': true };
        }

        return null;
    }

}