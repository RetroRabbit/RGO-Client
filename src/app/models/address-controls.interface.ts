import { FormControl } from '@angular/forms';

export interface AddressControls {
  unitNumber: FormControl<string | null>;
  complexName: FormControl<string | null>;
  suburbDistrict: FormControl<string | null>;
  streetNumber: FormControl<string | null>;
  country: FormControl<string | null>;
  province: FormControl<string | null>;
  postalCode: FormControl<string | null>;
}
