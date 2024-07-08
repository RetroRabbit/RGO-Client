import { Component } from '@angular/core';
import { TemplateItem } from 'src/app/models/hris/templateItem.interface';
import { Observable } from 'rxjs';
import { EvaluationTemplateItemService } from 'src/app/services/hris/evaluations/evaluation-template-item.service';
import { EvaluationTemplateService } from 'src/app/services/hris/evaluations/evaluation-template.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SnackbarService } from 'src/app/services/shared-services/snackbar-service/snackbar.service';

@Component({
  selector: 'app-template-items',
  templateUrl: './template-items.component.html',
  styleUrls: ['./template-items.component.css'],
})
export class TemplateItemsComponent {
  currentTab = 'Template';

  templates$: Observable<any[]> = this.evaluationtemplate.getAll();
  templateItems$: Observable<TemplateItem[]> =
    this.evaluationTemplateItemService.getAll();

  templateForm: FormGroup = new FormGroup({
    template: new FormControl<string>('', Validators.required),
  });

  templateItemForm: FormGroup = new FormGroup({
    template: new FormControl('', Validators.required),
    section: new FormControl('', Validators.required),
    question: new FormControl('', Validators.required),
  });

  constructor(
    private evaluationtemplate: EvaluationTemplateService,
    private evaluationTemplateItemService: EvaluationTemplateItemService,
    private snackBarService: SnackbarService,
  ) { }

  saveTemplate(): void {
    const { template } = this.templateForm.value;
    this.evaluationtemplate.save(template).subscribe({
      next: () => this.templates$ = this.evaluationtemplate.getAll(),
      error: (er) => this.snackBarService.showError(er),
    });
  }

  deleteTemplate(template: string): void {
    this.evaluationtemplate.delete(template).subscribe({
      next: () => this.templates$ = this.evaluationtemplate.getAll(),
      error: (er) => this.snackBarService.showError(er),
    });
  }

  editTemplateItems(template: string): void {
    this.currentTab = 'Template Items';
    this.templateItems$ = this.evaluationTemplateItemService.getAll(template);
    this.templateItemForm.patchValue({ template: template });
  }

  saveTemplateItem(): void {
    const { template, section, question } = this.templateItemForm.value;
    this.evaluationTemplateItemService
      .save(template, section, question)
      .subscribe(() => {
        this.templateItems$ =
          this.evaluationTemplateItemService.getAll(template);
      });
  }

  deleteTemplateItem(section: string, question: string): void {
    const template = this.templateItemForm.value.template;
    this.evaluationTemplateItemService
      .delete(template, section, question)
      .subscribe(() => {
        this.templateItems$ =
          this.evaluationTemplateItemService.getAll(template);
      });
  }
}
