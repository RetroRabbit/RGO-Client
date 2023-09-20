import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, tap } from 'rxjs';
import { Employee } from 'src/app/models/employee.interface';
import { EmployeeService } from 'src/app/services/employee.service';
import { EvaluationService } from 'src/app/services/evaluation.service';
import { Evaluation } from 'src/app/models/evaluation.interface';
import { Eval } from '../employee-evaluations/employee-evaluations.component';
import { CookieService } from 'ngx-cookie-service';
import { EmployeeEvaluationsRatingService } from 'src/app/services/employee-evaluations-rating.service';
import { EvaluationTemplateService } from 'src/app/services/evaluation-template.service';
import { EvaluationTemplateItemService } from 'src/app/services/evaluation-template-item.service';

@Component({
  selector: 'app-evaluations',
  templateUrl: './evaluations.component.html',
  styleUrls: ['./evaluations.component.css']
})
export class EvaluationsComponent {
  @Input() selectedEvaluation!: any | null

  employees$: Observable<Employee[]> = this.empoloyeeService.getAll()
  templates$: Observable<any[]> = this.evaluationtemplate.getAll()
  EvaluationForm: FormGroup = new FormGroup({
    ownerEmail: new FormControl(this.selectedEvaluation?.owner.email, Validators.required),
    employeeEmail: new FormControl(this.selectedEvaluation?.employee.email, Validators.required),
    template: new FormControl(this.selectedEvaluation?.template.description, Validators.required),
    subject: new FormControl(this.selectedEvaluation?.subject, Validators.required),
    startDate: new FormControl(this.selectedEvaluation?.startDate, Validators.required),
    ratings: new FormControl<any[]>([], Validators.required),
  })
  rating$: Observable<any[]> = this.evaluationRatingService.getall(this.selectedEvaluation)
  templateItems$!: Observable<any[]>

  constructor(
    private empoloyeeService: EmployeeService,
    private evaluationService: EvaluationService,
    private evaluationRatingService: EmployeeEvaluationsRatingService,
    private evaluationtemplate: EvaluationTemplateService,
    private evaluationTemplateItemService: EvaluationTemplateItemService,
    private cookieService: CookieService
  ) {}

  ngOnInit() {

  }

  templateChange() {
    if(this.EvaluationForm.value.template !== null && this.EvaluationForm.value.template !== ""){
      this.templateItems$ = this.evaluationTemplateItemService.getAll(this.EvaluationForm.value.template);
    }
  }

  tempChange(htmlValue : any){
    this.EvaluationForm.value.template = htmlValue.target.value;
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
