import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Employee } from 'src/app/models/employee.interface';
import { EmployeeService } from 'src/app/services/employee.service';
import { EvaluationService } from 'src/app/services/evaluation.service';
import { Evaluation } from 'src/app/models/evaluation.interface';
import { Eval } from '../employee-evaluations/employee-evaluations.component';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-evaluations',
  templateUrl: './evaluations.component.html',
  styleUrls: ['./evaluations.component.css']
})
export class EvaluationsComponent {
  @Input() selectedEvaluation!: Eval | null

  employees$: Observable<Employee[]> = this.empoloyeeService.getAll()
  templates$!: Observable<any[]>

  EvaluationForm!: FormGroup

  constructor(
    private empoloyeeService: EmployeeService,
    private evaluationService: EvaluationService,
    private cookieService: CookieService
  ) {}

  ngOnInit() {
    this.EvaluationForm = new FormGroup({
      ownerEmail: new FormControl(this.selectedEvaluation?.ownerEmail, Validators.required),
      employeeEmail: new FormControl(this.selectedEvaluation?.employeeEmail, Validators.required),
      template: new FormControl(this.selectedEvaluation?.template, Validators.required),
      subject: new FormControl(this.selectedEvaluation?.subject, Validators.required),
      startDate: new FormControl(this.selectedEvaluation?.startDate, Validators.required),
      description: new FormControl(this.selectedEvaluation?.description, Validators.required),
      rating: new FormControl(this.selectedEvaluation?.rating, Validators.required),
    })
  }

  save() {

  }

  update() {

  }

  remove() {

  }

  backToEvaluations() {
    this.cookieService.set('currentPage', 'Evaluations')
    this.selectedEvaluation = null
  }

  getEmployee(email: string) {
    let employeeId: number = 0
    this.employees$.subscribe(employees => {
      employees.forEach(employee => {
        if (employee.email === email) {
          employeeId = employee.id!
        }
      })
    })
    return employeeId
  }

  createEvaluation(): void {
    const employeeId = this.getEmployee(this.EvaluationForm.value.employeeEmail!)
    const ownerId = this.getEmployee(this.EvaluationForm.value.ownerEmail!)

    const evaluation: Evaluation = {
      id: 0,
      employeeId: employeeId,
      templateId: 1,
      ownerId: ownerId,
      subject: this.EvaluationForm.value.subject!,
      startDate: this.EvaluationForm.value.startDate!,
      endDate: null,
    }

    this.evaluationService.save(evaluation).subscribe(
      () => {
        this.EvaluationForm.reset()
        this.EvaluationForm.setValue({
          ownerEmail: '',
          employeeEmail: '',
          template: '',
          subject: '',
          startDate: new Date(Date.now()),
          description: '',
          comments: '',
        })
      },
      () => {
        this.EvaluationForm.reset()
        this.EvaluationForm.setValue({
          ownerEmail: '',
          employeeEmail: '',
          template: '',
          subject: '',
          startDate: new Date(Date.now()),
          description: '',
          comments: '',
        })
      }
    )
  }
}
