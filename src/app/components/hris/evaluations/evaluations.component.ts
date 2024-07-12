import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, catchError, map, of } from 'rxjs';
import { Employee } from 'src/app/models/hris/employee.interface';
import { EmployeeService } from 'src/app/services/hris/employee/employee.service';
import { EvaluationService } from 'src/app/services/hris/evaluations/evaluation.service';
import { CookieService } from 'ngx-cookie-service';
import { EvaluationTemplateService } from 'src/app/services/hris/evaluations/evaluation-template.service';
import { EvaluationTemplateItemService } from 'src/app/services/hris/evaluations/evaluation-template-item.service';
import { EvaluationInput } from 'src/app/models/hris/evaluation-input.interface';
import { EvaluationRatingInput } from 'src/app/models/hris/evaluation-rating-input.interface';
import { EvaluationAudienceService } from 'src/app/services/hris/evaluations/evaluation-audience.service';
import { EmployeeEvaluationsRatingService } from 'src/app/services/hris/evaluations/employee-evaluations-rating.service';
import { NavService } from 'src/app/services/shared-services/nav-service/nav.service';
import { SnackbarService } from 'src/app/services/shared-services/snackbar-service/snackbar.service';

@Component({
  selector: 'app-evaluations',
  templateUrl: './evaluations.component.html'
})
export class EvaluationsComponent {
  @Input() selectedEvaluation!: any | null;
  currentTab: string = 'Template';

  EvaluationForm: FormGroup = new FormGroup({
    ownerEmail: new FormControl<string>(
      this.selectedEvaluation ? this.selectedEvaluation?.owner.email : '',
      Validators.required
    ),
    employeeEmail: new FormControl<string>(
      this.selectedEvaluation ? this.selectedEvaluation?.employee.email : '',
      Validators.required
    ),
    template: new FormControl<string>(
      this.selectedEvaluation
        ? this.selectedEvaluation?.template.description
        : '',
      Validators.required
    ),
    subject: new FormControl<string>(
      this.selectedEvaluation ? this.selectedEvaluation?.subject : '',
      Validators.required
    ),
    startDate: new FormControl<Date>(new Date(Date.now()), Validators.required),
  });

  AudienceForm: FormGroup = new FormGroup({
    email: new FormControl<string>('', Validators.required),
  });

  RatingForm: FormGroup = new FormGroup({
    id: new FormControl<number>(0, Validators.required),
    employeeEmail: new FormControl<string>(
      this.cookieService.get('userEmail'),
      Validators.required
    ),
    evaluation: new FormControl<EvaluationInput>(
      this.evaluationInput,
      Validators.required
    ),
    description: new FormControl<string>('', Validators.required),
    score: new FormControl<number>(0, Validators.required),
    comment: new FormControl<string>('', Validators.required),
  });

  employees$!: Observable<Employee[]>;
  templates$!: Observable<any[]>;
  audience: { email: string; name: string }[] = [];
  rating$!: Observable<any[]>;

  stars: string[] = ['star', 'star', 'star', 'star'];
  templateItems: { [description: string]: { [section: string]: string[] } } =
    {};

  constructor(
    private empoloyeeService: EmployeeService,
    private evaluationService: EvaluationService,
    private evaluationRatingService: EmployeeEvaluationsRatingService,
    private evaluationtemplate: EvaluationTemplateService,
    private evaluationTemplateItemService: EvaluationTemplateItemService,
    private evaluationAudienceService: EvaluationAudienceService,
    private cookieService: CookieService,
    private navService: NavService,
    private snackBarService: SnackbarService,
  ) {
  }

  fetchAudience(): void {
    const evaluationInput: EvaluationInput = {
      id: 0,
      ownerEmail: this.selectedEvaluation?.owner.email,
      employeeEmail: this.selectedEvaluation?.employee.email,
      template: this.selectedEvaluation?.template.description,
      subject: this.selectedEvaluation?.subject,
    };

    this.evaluationAudienceService
      .getAll(evaluationInput)
      .pipe(
        map((data) =>
          data.map((member) => ({
            email: member?.employee?.email,
            name: `${member?.employee?.name} ${member?.employee?.surname}`,
          }))
        ),
        catchError(() => of([]))
      )
      .subscribe((audience) => (this.audience = audience));
  }

  updateRatings(): void {
    const evaluationInput: EvaluationInput = {
      id: 0,
      ownerEmail: this.selectedEvaluation?.owner.email,
      employeeEmail: this.selectedEvaluation?.employee.email,
      template: this.selectedEvaluation?.template.description,
      subject: this.selectedEvaluation?.subject,
    };

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

    this.templateChange();
  }

  ngOnInit() {
    this.employees$ = this.empoloyeeService.getAll();
    this.templates$ = this.evaluationtemplate.getAll();

    if (this.selectedEvaluation) {
      this.fetchAudience();
      this.updateRatings();
      this.setFormValues();
    } else {
      this.templateChange();
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
        catchError(() => of({}))
      )
      .subscribe((grouped) => {
        this.templateItems = grouped;
      });
  }

  tempChange(htmlValue: any) {
    this.EvaluationForm.patchValue({ template: htmlValue.target.value });
  }

  saveEvaluation() {
    const evaluation: EvaluationInput = this.evaluationInput;

    this.evaluationService.save(evaluation).subscribe({
      next: data => {
        this.EvaluationForm.reset();
        this.backToEvaluations();
      },
      error: (er) => this.snackBarService.showError(er),
  });
  }

  saveEvaluationAudience() {
    const evaluation: EvaluationInput = this.evaluationInput;

    this.evaluationAudienceService
      .save(this.AudienceForm.value.email, evaluation)
      .subscribe({
        next: data => {
          this.fetchAudience();
          this.updateRatings();
        },
        error: (er) => this.snackBarService.showError(er),
  });
  }

  deleteEvaluationAudience(email: string) {
    const evaluation: EvaluationInput = this.evaluationInput;

    this.evaluationAudienceService.delete(email, evaluation).subscribe({
      next: data => {
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
            catchError(() => of([]))
          )
          .subscribe((x) => (this.audience = x));

        this.rating$ = this.evaluationRatingService.getall({
          id: 0,
          ownerEmail: this.selectedEvaluation?.owner.email,
          employeeEmail: this.selectedEvaluation?.employee.email,
          template: this.selectedEvaluation?.template.description,
          subject: this.selectedEvaluation?.subject,
        });
      },
      error: (er) => this.snackBarService.showError(er),
  });
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

  get evaluationInput(): EvaluationInput {
    return {
      id: 0,
      ownerEmail: this.EvaluationForm.value.ownerEmail!,
      employeeEmail: this.EvaluationForm.value.employeeEmail!,
      template: this.EvaluationForm.value.template!,
      subject: this.EvaluationForm.value.subject!,
    };
  }

  saveEvaluationRating(question: string | null = null) {
    if (question) this.RatingForm.patchValue({ description: question });

    const evaluationInput: EvaluationInput = {
      id: 0,
      ownerEmail: this.EvaluationForm.value.ownerEmail!,
      employeeEmail: this.EvaluationForm.value.employeeEmail!,
      template: this.EvaluationForm.value.template!,
      subject: this.EvaluationForm.value.subject!,
    };
    this.RatingForm.patchValue({ evalaution: evaluationInput });

    const formData = this.evaluationRating;

    this.evaluationRatingService.save(formData).subscribe({
      next: data => {
        this.rating$ = this.evaluationRatingService.getall({
          id: 0,
          ownerEmail: this.selectedEvaluation?.owner.email,
          employeeEmail: this.selectedEvaluation?.employee.email,
          template: this.selectedEvaluation?.template.description,
          subject: this.selectedEvaluation?.subject,
        });
      },
      error: (er) => this.snackBarService.showError(er),
  });
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

    this.evaluationRatingService.delete(evaluationRating).subscribe({
      next: data => {
        this.rating$ = this.evaluationRatingService.getall({
          id: 0,
          ownerEmail: this.selectedEvaluation?.owner.email,
          employeeEmail: this.selectedEvaluation?.employee.email,
          template: this.selectedEvaluation?.template.description,
          subject: this.selectedEvaluation?.subject,
        });
      },
      error: (er) => this.snackBarService.showError(er),
  });
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
    this.evaluationService.update(evaluationInputs).subscribe({
      next: data => {
        this.EvaluationForm.reset();
        this.backToEvaluations();
      },
      error: (er) => this.snackBarService.showError(er),
  });
  }

  removeEvaluation() {
    const evaluationInput: EvaluationInput = this.evaluationInput;

    this.evaluationService.delete(evaluationInput).subscribe({
      next: data => {
        this.EvaluationForm.reset();
        this.backToEvaluations();
      },
      error: er => {
        this.EvaluationForm.reset();
        this.snackBarService.showError(er);
      }
  });
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
