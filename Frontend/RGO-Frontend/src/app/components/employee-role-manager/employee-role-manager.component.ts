import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Employee } from 'src/app/models/employee.interface';
import { EmployeeRoleService } from 'src/app/services/employee-role.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { RoleService } from 'src/app/services/role.service';

@Component({
  selector: 'app-employee-role-manager',
  templateUrl: './employee-role-manager.component.html',
  styleUrls: ['./employee-role-manager.component.css']
})
export class EmployeeRoleManagerComponent {
  roles$: Observable<string[]> = this.employeeRoleService.getAllRoles()
  employees$: Observable<Employee[]> = this.empoloyeeService.getAll()
  currRole!: Map<string, string[]>
  saved: boolean = false
  deleted: boolean = false
  failed: boolean = false

  newEmployeeForm = new FormGroup({
    email: new FormControl<string>('', Validators.required),
    role: new FormControl<string>('', Validators.required),
  })

  constructor(
    private roleService: RoleService,
    private empoloyeeService: EmployeeService,
    private employeeRoleService: EmployeeRoleService
  ) {}

  getRoles(raw: Map<string, string[]>): string[] {
    return Object.keys(raw)
  }

  changeEmail(email: string): void {
    this.newEmployeeForm.setValue({email: email, role: this.newEmployeeForm.value.role ?? ''})
  }

  changeRole(role: string): void {
    this.newEmployeeForm.setValue({email: this.newEmployeeForm.value.email ?? '', role: role})
  }

  assignRole(): void {
    this.employeeRoleService.addRole(this.newEmployeeForm.value.email!, this.newEmployeeForm.value.role!).subscribe(
      () => {
        this.newEmployeeForm.reset()
        this.newEmployeeForm.setValue({email: '', role: ''})
        this.saved = true
      },
      () => {
        this.newEmployeeForm.reset()
        this.newEmployeeForm.setValue({email: '', role: ''})
        this.failed = true
      }
    )
  }

  unassignRole(): void {
    this.employeeRoleService.removeRole(this.newEmployeeForm.value.email!, this.newEmployeeForm.value.role!).subscribe(
      () => {
        this.newEmployeeForm.reset()
        this.newEmployeeForm.setValue({email: '', role: ''})
        this.deleted = true
      },
      () => {
        this.newEmployeeForm.reset()
        this.newEmployeeForm.setValue({email: '', role: ''})
        this.failed = true
      }
    )
  }
}
