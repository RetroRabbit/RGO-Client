import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { Observable, map, startWith } from 'rxjs';
import { EmployeeDate } from 'src/app/models/employee-date.interface';
import { EmployeeDateService } from 'src/app/services/employee-date.service';
import { NotificationService } from 'src/app/services/notification.service';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-manage-employee-events',
  templateUrl: './manage-employee-events.component.html',
  styleUrls: ['./manage-employee-events.component.css']
})
export class ManageEmployeeEventsComponent {
  @Output() event = new EventEmitter<EmployeeDate | null>()
  employeeEvents$!: Observable<EmployeeDate[]>
  displayedColumns: string[] = ['operation', 'employee', 'subject', 'date'];

  emailPattern = /^[A-Za-z0-9._%+-]+@retrorabbit\.co\.za$/;
  eventForm: FormGroup = new FormGroup({
    email: new FormControl<string>('', [
      Validators.email,
      Validators.pattern(this.emailPattern),
    ]),
    subject: new FormControl<string>(''),
    date: new FormControl<Date>(new Date(Date.now())),
  })
  isLoading = false

  constructor(
    private employeeDateService: EmployeeDateService,
    private notificationService: NotificationService,
    private cookieService: CookieService,
    private snackBarService: SnackbarService) { }

  updateEvents(filter: {
    email?: string,
    subject?: string,
    date?: Date }) {
    this.employeeEvents$ = this.employeeDateService
      .getall(
        filter.email,
        filter.subject,
        filter.date
      ).pipe(
      startWith([]),
      map((employeeEvents) => employeeEvents || [])
    )
  }

  updateEventsbyCriteria(criteria: 'email' | 'subject' | 'date'): void {
    let filter = {}
    if (criteria === 'email') filter = { email: this.eventForm.value.email }
    if (criteria === 'subject') filter = { subject: this.eventForm.value.subject }
    if (criteria === 'date') filter = { date: new Date(this.eventForm.value.date).toISOString().split('T')[0] }
    this.updateEvents(filter)
  }

  ngOnInit(): void {
    this.updateEvents({});
  }

  deleteEvent(event: EmployeeDate): void {
    const employeeDateInput = {
      email: event.employee.email,
      subject: event.subject,
      note: event.note,
      date: event.date
    }

    this.employeeDateService.deleteEmployeeDate(employeeDateInput).subscribe(
      () => {
        this.updateEvents({})
        this.snackBarService.showSnackbar("Event deleted succesfully", "snack-success")
      },
      () => this.snackBarService.showSnackbar("Failed to delete event", "snack-error")
    );
  }

  onClear(): void {
    this.eventForm.reset();
    this.updateEvents({});
  }

  CaptureEvent(event: any) {
    const target = event.target as HTMLAnchorElement;
    this.event.emit(null)
    this.cookieService.set('currentPage', target.innerText);
  }

  viewEvent(event: EmployeeDate): void {
    this.event.emit(event)
    this.cookieService.set('currentPage', 'New Event');
  }
}
