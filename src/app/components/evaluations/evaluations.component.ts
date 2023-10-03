import { Component, Input } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Observable, catchError, map, of } from 'rxjs';
import { Employee } from 'src/app/models/employee.interface';
import { EmployeeService } from 'src/app/services/employee.service';
import { EvaluationService } from 'src/app/services/evaluation.service';
import { CookieService } from 'ngx-cookie-service';
import { EmployeeEvaluationsRatingService } from 'src/app/services/employee-evaluations-rating.service';
import { EvaluationTemplateService } from 'src/app/services/evaluation-template.service';
import { EvaluationTemplateItemService } from 'src/app/services/evaluation-template-item.service';
import { EvaluationInput } from 'src/app/models/evaluation-input.interface';
import { EvaluationRatingInput } from 'src/app/models/evaluation-rating-input.interface';
import { EvaluationAudienceService } from 'src/app/services/evaluation-audience.service';

@Component({
  selector: 'app-evaluations',
  templateUrl: './evaluations.component.html',
  styleUrls: ['./evaluations.component.css'],
})
export class EvaluationsComponent {
  @Input() selectedEvaluation!: any | null;
  currentTab: string = 'Template';

  EvaluationForm: FormGroup = new FormGroup({
    ownerEmail: new FormControl('', Validators.required),
    employeeEmail: new FormControl('', Validators.required),
    template: new FormControl('', Validators.required),
    subject: new FormControl('', Validators.required),
    startDate: new FormControl('', Validators.required),
  });

  AudienceForm: FormGroup = new FormGroup({
    email: new FormControl<string>('', Validators.required),
  });

  RatingForm: FormGroup = new FormGroup({
    description: new FormControl<string>('', Validators.required),
    score: new FormControl<number>(0, Validators.required),
    comment: new FormControl<string>('', Validators.required),
  });

  employees$!: Observable<Employee[]>
  templates$!: Observable<any[]>
  audience: { email: string; name: string }[] = []
  rating$!: Observable<any[]>;

  stars: string[] = ['star', 'star', 'star', 'star', 'star'];
  templateItems: { [description: string]: { [section: string]: string[] } } =
    {};

  constructor(
    private empoloyeeService: EmployeeService,
    private evaluationService: EvaluationService,
    private evaluationRatingService: EmployeeEvaluationsRatingService,
    private evaluationtemplate: EvaluationTemplateService,
    private evaluationTemplateItemService: EvaluationTemplateItemService,
    private evaluationAudienceService: EvaluationAudienceService,
    private cookieService: CookieService
  ) { }

  fetchAudience(): void {
    const evaluationInput: EvaluationInput = {
      id: 0,
      ownerEmail: this.selectedEvaluation?.owner.email,
      employeeEmail: this.selectedEvaluation?.employee.email,
      template: this.selectedEvaluation?.template.description,
      subject: this.selectedEvaluation?.subject,
    }

    this.evaluationAudienceService
    .getAll(evaluationInput)
    .pipe(
      map(data => data.map(member => ({
        email: member?.employee?.email,
        name: `${member?.employee?.name} ${member?.employee?.surname}`
      }))),
      catchError(() => {
        return of([]);
      })
    ).subscribe(audience => this.audience = audience);
  }

  updateRatings(): void {
    const evaluationInput: EvaluationInput = {
      id: 0,
      ownerEmail: this.selectedEvaluation?.owner.email,
      employeeEmail: this.selectedEvaluation?.employee.email,
      template: this.selectedEvaluation?.template.description,
      subject: this.selectedEvaluation?.subject,
    }

    this.rating$ = this.evaluationRatingService.getall(evaluationInput);
  }

  setFormValues(): void {
    this.EvaluationForm.setValue({
      ownerEmail: this.selectedEvaluation
        ? this.selectedEvaluation?.owner.email
        : '',
      employeeEmail: this.selectedEvaluation
        ? this.selectedEvaluation?.employee.email
        : '',
      template: this.selectedEvaluation
        ? this.selectedEvaluation?.template.description
        : '',
      subject: this.selectedEvaluation ? this.selectedEvaluation?.subject : '',
      startDate: new Date(Date.now()),
    });

    this.templateChange()
  }

  ngOnInit() {
    this.employees$ = this.empoloyeeService.getAll();
    this.templates$ = this.evaluationtemplate.getAll();

    if (this.selectedEvaluation) {
      this.fetchAudience();
      this.updateRatings();
      this.setFormValues();
    } else {
      this.templateChange()
    }
  }

  templateChange() {
    let templateItemSub: Observable<any[]> | null;
    if (
      this.EvaluationForm.value.template !== null &&
      this.EvaluationForm.value.template !== ''
    )
      templateItemSub = this.evaluationTemplateItemService.getAll(
        this.EvaluationForm.value.template
      );
    else return;

    templateItemSub
      ?.pipe(
        map((items) => {
          const grouped: {
            [description: string]: { [section: string]: string[] };
          } = {};
          items.forEach((item) => {
            const templateDesc: string = item?.template?.description;
            const section: string = item?.section;

            if (!grouped[templateDesc]) grouped[templateDesc] = {};

            if (!grouped[templateDesc][section])
              grouped[templateDesc][section] = [];

            grouped[templateDesc][section].push(item?.question);
          });

          return grouped;
        }),
        catchError((error) => {
          console.error(`Error: ${error}`);
          return of({});
        })
      )
      .subscribe((grouped) => {
        this.templateItems = grouped;
      });
  }

  tempChange(htmlValue: any) {
    this.EvaluationForm.patchValue({ template: htmlValue.target.value });
  }

  saveEvaluation() {
    console.table(this.EvaluationForm.value);
    const evaluation: EvaluationInput = this.evaluationInput

    this.evaluationService.save(evaluation).subscribe(
      () => {
        this.EvaluationForm.reset();
        this.backToEvaluations();
      },
      () => { }
    );
  }

  saveEvaluationAudience() {
    const evaluation: EvaluationInput = this.evaluationInput;

    this.evaluationAudienceService
      .save(this.AudienceForm.value.email, evaluation)
      .subscribe(
        () => {
          this.fetchAudience()
          this.updateRatings()
        },
        () => { }
      );
  }

  deleteEvaluationAudience(email: string) {
    const evaluation: EvaluationInput = this.evaluationInput;

    this.evaluationAudienceService
      .delete(email, evaluation)
      .subscribe(
        () => {
          console.info('Evaluation audience deleted');
          this.evaluationAudienceService
            .getAll({
              id: 0,
              ownerEmail: this.selectedEvaluation?.owner.email,
              employeeEmail: this.selectedEvaluation?.employee.email,
              template: this.selectedEvaluation?.template.description,
              subject: this.selectedEvaluation?.subject,
            })
            .pipe(
              map((data) => {
                const audience: { email: string; name: string }[] = [];
                data.forEach((member) => {
                  const employee = member?.employee as Employee;
                  audience.push({
                    email: employee.email as string,
                    name: employee.name + ' ' + employee.surname,
                  });
                });
                return audience;
              }),
              catchError((error) => {
                console.error(`Error: ${error}`);
                return of([]);
              })
            )
            .subscribe(x => this.audience = x)

          this.rating$ = this.evaluationRatingService.getall({
            id: 0,
            ownerEmail: this.selectedEvaluation?.owner.email,
            employeeEmail: this.selectedEvaluation?.employee.email,
            template: this.selectedEvaluation?.template.description,
            subject: this.selectedEvaluation?.subject,
          });
        },
        () => {
          console.error('Error deleting evaluation audience');
        }
      );
  }

  get evaluationRating(): EvaluationRatingInput {
    return {
      id: 0,
      employeeEmail: this.cookieService.get('userEmail'),
      evaluation: this.evaluationInput,
      description: this.RatingForm.value.description,
      score: this.RatingForm.value.score,
      comment: this.RatingForm.value.comment,
    };
  }

  saveEvaluationRating() {
    this.evaluationRatingService.save(this.evaluationRating).subscribe(
      () => {
        console.info('Evaluation rating saved');
        this.rating$ = this.evaluationRatingService.getall({
          id: 0,
          ownerEmail: this.selectedEvaluation?.owner.email,
          employeeEmail: this.selectedEvaluation?.employee.email,
          template: this.selectedEvaluation?.template.description,
          subject: this.selectedEvaluation?.subject,
        });
      },
      () => {
        console.error('Error saving evaluation rating');
      }
    );
  }

  deleteEvaluationRating(rating: any) {
    const evaluationRating: EvaluationRatingInput = {
      id: rating.id,
      employeeEmail: rating.employee.email,
      evaluation: this.evaluationInput,
      description: rating.description,
      score: rating.score,
      comment: rating.comment,
    };

    this.evaluationRatingService.delete(evaluationRating).subscribe(
      () => {
        console.info('Evaluation rating deleted');
        this.rating$ = this.evaluationRatingService.getall({
          id: 0,
          ownerEmail: this.selectedEvaluation?.owner.email,
          employeeEmail: this.selectedEvaluation?.employee.email,
          template: this.selectedEvaluation?.template.description,
          subject: this.selectedEvaluation?.subject,
        });
      },
      () => {
        console.error('Error deleting evaluation rating');
      }
    );
  }

  clearRatingForm() {
    this.RatingForm.reset();
    this.stars = ['star', 'star', 'star', 'star', 'star'];
  }

  updateEvaluation() {
    const evaluationInputs: EvaluationInput[] = [
      this.evaluationInput,
      {
        id: null,
        ownerEmail: this.EvaluationForm.value.ownerEmail!,
        employeeEmail: this.EvaluationForm.value.employeeEmail!,
        template: this.EvaluationForm.value.template!,
        subject: this.EvaluationForm.value.subject!,
      },
    ];
    this.evaluationService.update(evaluationInputs).subscribe(
      () => {
        this.EvaluationForm.reset();
        this.backToEvaluations();
      },
      () => { }
    );
  }

  get evaluationInput(): EvaluationInput {
    return {
      id: 0,
      ownerEmail: this.EvaluationForm.value.ownerEmail!,
      employeeEmail: this.EvaluationForm.value.employeeEmail!,
      template: this.EvaluationForm.value.template!,
      subject: this.EvaluationForm.value.subject!,
    };
  }

  removeEvaluation() {
    const evaluationInput: EvaluationInput = this.evaluationInput;

    this.evaluationService.delete(evaluationInput).subscribe(
      () => {
        this.EvaluationForm.reset();
        this.backToEvaluations();
      },
      () => {
        this.EvaluationForm.reset();
      }
    );
  }

  backToEvaluations() {
    this.cookieService.set('currentPage', 'Evaluations');
    this.selectedEvaluation = null;
  }

  rate(selectedStar: string, index: number) {
    ++index;
    for (let i = 0; i < this.stars.length; i++) {
      this.stars[i] = i < index ? (this.stars[i] = 'star-filled') : 'star';
    }
  }
}
