import { Component, EventEmitter, Output } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable, of } from 'rxjs';
import { Employee } from 'src/app/models/employee.interface';
import { EmployeeService } from 'src/app/services/employee.service';

export interface Eval {
  ownerEmail: string,
  employeeEmail: string,
  subject: string,
  template: string,
  startDate: Date,
  endDate: Date | null,
  description: string | null,
  rating: {
    by: Employee | null
    comment: string | null,
    score: number | null,
  }[]
}

@Component({
  selector: 'app-employee-evaluations',
  templateUrl: './employee-evaluations.component.html',
  styleUrls: ['./employee-evaluations.component.css']
})
export class EmployeeEvaluationsComponent {
  @Output() selectedEvaluation = new EventEmitter<Eval>()

  employees$: Observable<Employee[]> = this.empoloyeeService.getAll()
  evaluations$: Observable<Eval[]> = of([
    {
      ownerEmail: 'kmatsomela@retrorabbit.co.za',
      employeeEmail: 'mschoeman@retrorabbit.co.za',
      subject: 'Check in',
      template: 'Mental Health - Check in',
      startDate: new Date(Date.now()),
      endDate: null,
      description: null,
      rating: [{
        by: null,
        comment: "Your dumb",
        score: 2
      }]
    }
  ])

  selectedEval!: Eval | null
  
  constructor(
    private empoloyeeService: EmployeeService,
    private cookieService: CookieService
  ) { }

  selectEvaluation(evaluation: Eval): void {
    this.selectedEval = evaluation
    this.selectedEvaluation.emit(evaluation)
    console.table(evaluation)
    this.cookieService.set('currentPage', 'Evaluation Form')
  }
}
