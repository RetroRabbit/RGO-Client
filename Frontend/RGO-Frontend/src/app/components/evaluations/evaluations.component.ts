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
import { EvaluationInput } from 'src/app/models/evaluation-input.interface';

@Component({
  selector: 'app-evaluations',
  templateUrl: './evaluations.component.html',
  styleUrls: ['./evaluations.component.css']
})
export class EvaluationsComponent {
  @Input() selectedEvaluation!: any | null

  employees$: Observable<Employee[]> = this.empoloyeeService.getAll()
  templates$: Observable<any[]> = this.evaluationtemplate.getAll()
  rating$: Observable<any[]> = this.evaluationRatingService.getall(this.selectedEvaluation)
  comment$: Observable<any[]> = this.evaluationRatingService.getall(this.selectedEvaluation)
  templateItems$!: Observable<any[]>

  EvaluationForm: FormGroup = new FormGroup({
    ownerEmail: new FormControl('', Validators.required),
    employeeEmail: new FormControl('', Validators.required),
    template: new FormControl('', Validators.required),
    subject: new FormControl('', Validators.required),
    startDate: new FormControl(Date.now(), Validators.required),
    audience: new FormControl<string[]>([], Validators.required),
    ratings: new FormControl<any[]>([], Validators.required),
    comments: new FormControl<string>('', Validators.required)
  })

  increaseAudience() {
    this.EvaluationForm.value.audience.push('')
  }

  decreaseAudience() {
    this.EvaluationForm.value.audience.pop()
  }

  stars: string[] = ['star', 'star', 'star', 'star', 'star'];
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
    console.table({
      ownerEmail: this.selectedEvaluation?.owner.email,
      employeeEmail: this.selectedEvaluation?.employee.email,
      template: this.selectedEvaluation?.template.description,
      subject: this.selectedEvaluation?.subject,
      comment: this.selectedEvaluation?.comment
    })
    this.EvaluationForm.setValue({
      ownerEmail: this.selectedEvaluation ? this.selectedEvaluation?.owner.email : '',
      employeeEmail: this.selectedEvaluation ? this.selectedEvaluation?.employee.email : '',
      template: this.selectedEvaluation ? this.selectedEvaluation?.template.description : '',
      subject: this.selectedEvaluation ? this.selectedEvaluation?.subject : '',
      startDate: new Date(Date.now()),
      comments: this.selectedEvaluation ? this.selectedEvaluation?.comments : '',
      
      audience: [],
      ratings: [],
    })
    this.templateChange()
  }

  templateChange() {
    if(this.EvaluationForm.value.template !== null
      && this.EvaluationForm.value.template !== "")
      this.templateItems$ = this.evaluationTemplateItemService
      .getAll(this.EvaluationForm.value.template)

    this.templateItems$?.pipe(
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
    const evaluationInput: EvaluationInput = {
      id: null,
      ownerEmail: this.EvaluationForm.value.ownerEmail!,
      employeeEmail: this.EvaluationForm.value.employeeEmail!,
      template: this.EvaluationForm.value.template!,
      subject: this.EvaluationForm.value.subject!,
      comment: this.EvaluationForm.value.subject!
    }

    this.evaluationService.save(evaluationInput).subscribe(
        () => {
          this.EvaluationForm.reset()
          this.backToEvaluations()
        },
        () => {
        }
      )
  }

  update() {
    const evaluationInputs: EvaluationInput[] = [
      {
        id: this.selectedEvaluation?.id,
        ownerEmail: this.selectedEvaluation?.owner.email,
        employeeEmail: this.selectedEvaluation?.employee.email,
        template: this.selectedEvaluation?.template.description,
        subject: this.selectedEvaluation?.subject,
        comment: this.selectedEvaluation?.comment
      },
      {
        id: null,
        ownerEmail: this.EvaluationForm.value.ownerEmail!,
        employeeEmail: this.EvaluationForm.value.employeeEmail!,
        template: this.EvaluationForm.value.template!,
        subject: this.EvaluationForm.value.subject!,
        comment: this.EvaluationForm.value.comment!
      }
    ]
    this.evaluationService.update(evaluationInputs).subscribe(
        () => {
          this.EvaluationForm.reset()
          this.backToEvaluations()
        },
        () => {
        }
      )
  }

  remove() {
    const evaluationInput: EvaluationInput = {
      id: this.selectedEvaluation?.id,
      ownerEmail: this.selectedEvaluation?.owner.email,
      employeeEmail: this.selectedEvaluation?.employee.email,
      template: this.selectedEvaluation?.template.description,
      subject: this.selectedEvaluation?.subject,
      comment: this.selectedEvaluation?.comment
    }

    this.evaluationService.delete(evaluationInput).subscribe(
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

  rate(selectedStar: string, index : number) {
    ++index;
    for (let i = 0; i < this.stars.length; i++) {
      this.stars[i] = i < index ? this.stars[i] = "star-filled" : "star";
    }
  }
}
