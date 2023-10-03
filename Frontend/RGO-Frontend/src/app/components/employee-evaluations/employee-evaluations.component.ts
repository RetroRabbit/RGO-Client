import { Component, EventEmitter, Output } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { Employee } from 'src/app/models/employee.interface';
import { EmployeeService } from 'src/app/services/employee.service';
import { EvaluationService } from 'src/app/services/evaluation.service';

@Component({
  selector: 'app-employee-evaluations',
  templateUrl: './employee-evaluations.component.html',
  styleUrls: ['./employee-evaluations.component.css'],
})
export class EmployeeEvaluationsComponent {
  @Output() selectedEvaluation = new EventEmitter<any>();

  currentTab: string = 'Evaluations';

  employees$: Observable<Employee[]> = this.empoloyeeService.getAll();
  evaluations$: Observable<any[]> = this.evaluationService.getAll(
    decodeURIComponent(this.cookieService.get('userEmail'))
  );
  selectedEval!: any | null;

  constructor(
    private empoloyeeService: EmployeeService,
    private evaluationService: EvaluationService,
    private cookieService: CookieService
  ) {}

  goToEvaluationForm() {
    this.cookieService.set('currentPage', 'Evaluation Form');
  }

  goToEvaluationsWithoutSelection() {
    this.selectedEvaluation.emit(null);
    this.goToEvaluationForm();
  }

  selectEvaluation(evaluation: any): void {
    this.selectedEval = evaluation;
    this.selectedEvaluation.emit(this.selectedEval);
    this.goToEvaluationForm();
  }
}
