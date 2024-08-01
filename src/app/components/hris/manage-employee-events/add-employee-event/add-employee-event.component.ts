import { Component, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { EmployeeDateInput } from 'src/app/models/hris/employe-date.interface';
import { Employee } from 'src/app/models/hris/employee.interface';
import { EmployeeDateService } from 'src/app/services/hris/employee/employee-date.service';
import { SnackbarService } from 'src/app/services/shared-services/snackbar-service/snackbar.service';
import { EmployeeDate } from 'src/app/models/hris/employee-date.interface';
import { NavService } from 'src/app/services/shared-services/nav-service/nav.service';
import { EmployeeProfileService } from 'src/app/services/hris/employee/employee-profile.service';
@Component({
  selector: 'app-add-employee-event',
  templateUrl: './add-employee-event.component.html',
  styleUrls: ['./add-employee-event.component.css']
})
export class AddEmployeeEventComponent {
  private _selectedEvent: EmployeeDate | null = null
  @Input()
  set selectedEvent(event: EmployeeDate | null) {
    if (event && typeof event === 'object') {
      this._selectedEvent = event
    }
  }

  get selectedEvent(): EmployeeDate | null {
    return this._selectedEvent
  }

  eventForm: FormGroup = new FormGroup({
    email: new FormControl<string>('', [
      Validators.required,
      Validators.email
    ]),
    subject: new FormControl<string>('', Validators.required),
    note: new FormControl<string>('', Validators.required),
    date: new FormControl<Date>(new Date(Date.now()), Validators.required),
  })

  employees$: Observable<Employee[]> = this.employeeProfileService.getAll()
  isLoading = false
  isEditing = false

  constructor(
    private employeeProfileService: EmployeeProfileService,
    private employeeDateService: EmployeeDateService,
    private cookieService: CookieService,
    private snackBarService: SnackbarService,
    private navService : NavService) {
     }

  ngOnInit(): void {
    if (this.selectedEvent) {
      this.isEditing = true
      this.eventForm.get('email')?.disable()
      this.eventForm.patchValue({
        email: this.selectedEvent.employee.email,
        subject: this.selectedEvent.subject,
        note: this.selectedEvent.note,
        date: new Date(this.selectedEvent.date)
      })
    }
  }

  onSubmit(): void {
    this.isLoading = true
    const event: EmployeeDateInput = {
      email: this.eventForm.value.email,
      subject: this.eventForm.value.subject,
      note: this.eventForm.value.note,
      date: new Date(this.eventForm.value.date).toISOString().split('T')[0]
    }

    if (this.isEditing) {
      const employeeDate: EmployeeDate = {
        id: this.selectedEvent!.id,
        employee: this.selectedEvent!.employee,
        subject: this.eventForm.value.subject,
        note: this.eventForm.value.note,
        date: new Date(this.eventForm.value.date).toISOString().split('T')[0]
      }
      this.employeeDateService.updateEmployeeDate(employeeDate).subscribe(
        () => {
          this.isLoading = false
          this.snackBarService.showSnackbar("Updated", "snack-success")
        },
        () => {
          this.isLoading = false
          this.snackBarService.showSnackbar("Unable to Update Event", "snack-error")
        }
      );
      return
    }

    this.employeeDateService.saveEmployeeDate(event).subscribe(
      () => {
        this.isLoading = false
        this.snackBarService.showSnackbar("Saved", "snack-success")
      },
      () => {
        this.isLoading = false
        this.snackBarService.showSnackbar("Unable to Update Event", "snack-error");
      }
    );
  }

  onClear(): void {
    this.eventForm.reset();
  }

  CaptureEvent() {
    this.cookieService.set('currentPage', 'Manage Employee Events');
  }
}
