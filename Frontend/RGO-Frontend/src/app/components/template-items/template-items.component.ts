import { Component } from '@angular/core';
import { TemplateItem } from 'src/app/models/templateItem.interface';
import { Observable } from 'rxjs';
import { EvaluationTemplateItemService } from 'src/app/services/evaluation-template-item.service';
import { EvaluationTemplateService } from 'src/app/services/evaluation-template.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';



@Component({
  selector: 'app-template-items',
  templateUrl: './template-items.component.html',
  styleUrls: ['./template-items.component.css']
})

export class TemplateItemsComponent {
  currentTab = 'Template'

  templates$: Observable<any[]> = this.evaluationtemplate.getAll()
  templateItems$: Observable<TemplateItem[]> = this.evaluationTemplateItemService.getAll()

  templateForm: FormGroup = new FormGroup({
    template: new FormControl<string>('', Validators.required)
  })

  templateItemForm: FormGroup = new FormGroup({
    template: new FormControl('', Validators.required),
    section: new FormControl('', Validators.required),
    question: new FormControl('', Validators.required)
  })

  constructor(
    private evaluationtemplate: EvaluationTemplateService,
    private evaluationTemplateItemService: EvaluationTemplateItemService
  ){}

  saveTemplate(): void {
    const { template } = this.templateForm.value
    this.evaluationtemplate.save(template).subscribe(
      () => {
      this.templateForm.reset()
      this.templates$ = this.evaluationtemplate.getAll()
    }, () => {})
  }

  deleteTemplate(template: string): void {
    this.evaluationtemplate.delete(template).subscribe(
      () => {
      this.templateForm.reset()
      this.templates$ = this.evaluationtemplate.getAll()
    }, () => {})
  }

  editTemplateItems(template: string): void {
    this.currentTab = 'Template Items'
    this.templateItems$ = this.evaluationTemplateItemService.getAll(template)
    this.templateItemForm.patchValue({ template: template })
  }
  
  saveTemplateItem(): void {
    const { template, section, question } = this.templateItemForm.value
    this.evaluationTemplateItemService.save(template, section, question).subscribe(() => {
      this.templateItemForm.reset()
      this.templateItems$ = this.evaluationTemplateItemService.getAll(template)
    })
  }

  deleteTemplateItem(section: string, question: string): void {
    const template = this.templateItemForm.value.template
    this.evaluationTemplateItemService.delete(template, section, question).subscribe(() => {
      this.templateItems$ = this.evaluationTemplateItemService.getAll(template)
    })
  }
}
