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
    ownerEmail: new FormControl('', Validators.required),
    employeeEmail: new FormControl('', Validators.required),
    template: new FormControl('', Validators.required),
    subject: new FormControl('', Validators.required),
    startDate: new FormControl(Date.now(), Validators.required),
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
    this.EvaluationForm.setValue({
      ownerEmail: this.selectedEvaluation?.ownerEmail,
      employeeEmail: this.selectedEvaluation?.employeeEmail,
      template: this.selectedEvaluation?.template,
      subject: this.selectedEvaluation?.subject,
      startDate: new Date(Date.now()),
      ratings: [],
    })
  }

  templateChange() {
    if(this.EvaluationForm.value.template !== null && this.EvaluationForm.value.template !== ""){
      this.templateItems$ = this.evaluationTemplateItemService.getAllByTemplate(this.EvaluationForm.value.template);
    }
  }

  tempChange(htmlValue : any){
    this.EvaluationForm.value.template = htmlValue.target.value;
  }
  save() {
    this.evaluationService.save(
      this.EvaluationForm.value.employeeEmail!,
      this.EvaluationForm.value.ownerEmail!,
      this.EvaluationForm.value.template!,
      this.EvaluationForm.value.subject!)
      .subscribe(
        () => {
          this.EvaluationForm.reset()
        },
        () => {
          this.EvaluationForm.reset()
        }
      )
  }

  update() {

  }

  remove() {
    this.evaluationService.delete(
      this.EvaluationForm.value.employeeEmail!,
      this.EvaluationForm.value.ownerEmail!,
      this.EvaluationForm.value.template!,
      this.EvaluationForm.value.subject!)
      .subscribe(
        () => {
          this.EvaluationForm.reset()
        },
        () => {
          this.EvaluationForm.reset()
        }
      )
  }

  backToEvaluations() {
    this.cookieService.set('currentPage', 'Evaluations')
    this.selectedEvaluation = null
  }

  createEvaluation(): void {
    this.evaluationService.save(this.EvaluationForm.value.employeeEmail!, this.EvaluationForm.value.ownerEmail!, this.EvaluationForm.value.template!, this.EvaluationForm.value.subject!).subscribe(
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
