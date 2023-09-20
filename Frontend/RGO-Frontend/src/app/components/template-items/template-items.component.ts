import { Component } from '@angular/core';
import { TemplateItem } from 'src/app/models/templateItem.interface';
import { Observable } from 'rxjs';
import { EvaluationTemplateItemService } from 'src/app/services/evaluation-template-item.service';



@Component({
  selector: 'app-template-items',
  templateUrl: './template-items.component.html',
  styleUrls: ['./template-items.component.css']
})

export class TemplateItemsComponent {

  constructor(private evaluationTemplateItemService: EvaluationTemplateItemService){}

  templateItems$ !:Observable<TemplateItem[]>;

  ngOnInit(){
    this.templateItems$ = this.evaluationTemplateItemService.getAll();
}
}
