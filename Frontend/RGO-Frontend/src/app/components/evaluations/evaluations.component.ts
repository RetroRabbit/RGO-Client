import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { Employee } from 'src/app/models/employee.interface';
import { EmployeeService } from 'src/app/services/employee.service';
import { EvaluationService } from 'src/app/services/evaluation.service';
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

  templateItems: { [description: string]: { [section: string]: string[] }} = {} 

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
      ownerEmail: this.selectedEvaluation.owner.email,
      employeeEmail: this.selectedEvaluation.employee.email,
      template: this.selectedEvaluation.template.description,
      subject: this.selectedEvaluation.subject,
      startDate: new Date(Date.now()),
      ratings: [],
    })
    this.templateChange()
  }

  templateChange() {
    if(this.EvaluationForm.value.template !== null && this.EvaluationForm.value.template !== "")
      this.templateItems$ = this.evaluationTemplateItemService.getAll(this.EvaluationForm.value.template)

    this.templateItems$.pipe(
      map(items => {
        const grouped: { [description: string]: { [section: string]: string[] }} = {}
        items.forEach(item => {
          const templateDesc: string = item?.template?.description
          const section: string = item?.section

          if(!grouped[templateDesc]) grouped[templateDesc] = {}

          if(!grouped[templateDesc][section]) grouped[templateDesc][section] = []

          grouped[templateDesc][section].push(item?.question)
        })

        return grouped
      }),
      catchError(error => {
        console.error(`Error: ${error}`)
        return of({})
      })
    ).subscribe(grouped => {
      this.templateItems = grouped
    })
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
          this.backToEvaluations()
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
          this.backToEvaluations()
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
