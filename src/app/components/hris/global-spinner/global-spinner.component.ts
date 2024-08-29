import { Component } from '@angular/core';
import { LoaderService } from 'src/app/services/shared-services/loader-service/loader.service';

@Component({
  selector: 'app-global-spinner',
  templateUrl: './global-spinner.component.html',
  styleUrls: ['./global-spinner.component.css']
})
export class GlobalSpinnerComponent {

  constructor(public loader: LoaderService) { }
}
