import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Employee } from 'src/app/models/employee.interface';
import { EmployeeService } from 'src/app/services/employee.service';
import { EvaluationService } from 'src/app/services/evaluation.service';
import { Evaluation } from 'src/app/models/evaluation.interface';

@Component({
  selector: 'app-evaluations',
  templateUrl: './evaluations.component.html',
  styleUrls: ['./evaluations.component.css']
})
export class EvaluationsComponent {
  employees$: Observable<Employee[]> = this.empoloyeeService.getAll()
  templates$!: Observable<any[]>

  EvaluationForm = new FormGroup({
    ownerEmail: new FormControl<string>('', Validators.required),
    employeeEmail: new FormControl<string>('', Validators.required),
    template: new FormControl<string>('', Validators.required),
    subject: new FormControl<string>('', Validators.required),
    startDate: new FormControl<Date>(new Date(Date.now()), Validators.required),
  })

  constructor(
    private empoloyeeService: EmployeeService,
    private evaluationService: EvaluationService
  ) {}

  getEmployee(email: string) {
    let employeeId: number = 0
    this.employees$.subscribe(employees => {
      employees.forEach(employee => {
        if (employee.email === email) {
          employeeId = employee.id!
        }
      })
    })
    return employeeId
  }

  createEvaluation(): void {
    const employeeId = this.getEmployee(this.EvaluationForm.value.employeeEmail!)
    const ownerId = this.getEmployee(this.EvaluationForm.value.ownerEmail!)

    const evaluation: Evaluation = {
      id: 0,
      employeeId: employeeId,
      templateId: 1,
      ownerId: ownerId,
      subject: this.EvaluationForm.value.subject!,
      startDate: this.EvaluationForm.value.startDate!,
      endDate: null,
    }

    this.evaluationService.save(evaluation).subscribe(
      () => {
        this.EvaluationForm.reset()
        this.EvaluationForm.setValue({
          ownerEmail: '',
          employeeEmail: '',
          template: '',
          subject: '',
          startDate: new Date(Date.now()),
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
        })
      }
    )
  }
}
