import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { EmployeeDateInput } from 'src/app/models/employe-date.interface';
import { Employee } from 'src/app/models/employee.interface';
import { EmployeeDateService } from 'src/app/services/employee-date.service';
import { EmployeeService } from 'src/app/services/employee/employee.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-add-employee-event',
  templateUrl: './add-employee-event.component.html',
  styleUrls: ['./add-employee-event.component.css']
})
export class AddEmployeeEventComponent {
  eventForm: FormGroup = new FormGroup({
    email: new FormControl<string>('', [
      Validators.required,
      Validators.email
    ]),
    subject: new FormControl<string>('', Validators.required),
    note: new FormControl<string>('', Validators.required),
    date: new FormControl<Date>(new Date(Date.now()), Validators.required),
  })

  employees$: Observable<Employee[]> = this.employeeService.getAll()
  isLoading = false

  constructor(
    private employeeService: EmployeeService,
    private employeeDateService: EmployeeDateService,
    private notificationService: NotificationService,
    private cookieService: CookieService) { }

  onSubmit(): void {
    this.isLoading = true
    const event: EmployeeDateInput = {
      email: this.eventForm.value.email,
      subject: this.eventForm.value.subject,
      note: this.eventForm.value.note,
      date: new Date(this.eventForm.value.date).toISOString().split('T')[0]
    }
    this.employeeDateService.saveEmployeeDate(event).subscribe(
      () => {
        this.isLoading = false
        this.notificationService.showToast('Event saved successfully', 'success')
      },
      () => {
        this.isLoading = false
        this.notificationService.showToast('Failed to save event', 'error')
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
