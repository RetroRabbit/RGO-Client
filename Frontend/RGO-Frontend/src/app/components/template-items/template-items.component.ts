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
  templates$: Observable<any[]> = this.evaluationtemplate.getAll()
  templateItems$: Observable<TemplateItem[]> = this.evaluationTemplateItemService.getAll()

  templateItemForm: FormGroup = new FormGroup({
    template: new FormControl('', Validators.required),
    section: new FormControl('', Validators.required),
    question: new FormControl('', Validators.required)
  })

  constructor(
    private evaluationtemplate: EvaluationTemplateService,
    private evaluationTemplateItemService: EvaluationTemplateItemService
  ){}

  clearForm(): void {
    this.templateItemForm.reset()
  }
  
  save(): void {
    const { template, section, question } = this.templateItemForm.value
    this.evaluationTemplateItemService.save(template, section, question).subscribe(() => {
      this.templateItemForm.reset()
      this.templateItems$ = this.evaluationTemplateItemService.getAll()
    })
  }

  delete(template: string, section: string, question: string): void {
    this.evaluationTemplateItemService.delete(template, section, question).subscribe(() => {
      this.templateItems$ = this.evaluationTemplateItemService.getAll()
    })
  }
}
