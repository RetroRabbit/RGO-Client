import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Employee } from 'src/app/models/employee.interface';
import { EmployeeService } from 'src/app/services/employee.service';
import { RoleService } from 'src/app/services/role.service';

@Component({
  selector: 'app-role-manager',
  templateUrl: './role-manager.component.html',
  styleUrls: ['./role-manager.component.css']
})
export class RoleManagerComponent {
  rawRoles$: Observable<Map<string, string[]>> = this.roleService.getAllRoles()
  employees$: Observable<Employee[]> = this.employeeService.getAll()

  saved: boolean = false
  deleted: boolean = false
  failed: boolean = false

  currRole!: Map<string, string[]>

  newRoleForm = new FormGroup({
    role: new FormControl('', Validators.required),
    permission: new FormControl('', Validators.required),
  })

  constructor(
    private roleService: RoleService,
    private employeeService: EmployeeService) { }

  getRoles(raw: Map<string, string[]>): string[] {
    return Object.keys(raw)
  }

  getPermissions(raw: Map<string, string[]>): string[] {
    return Object.values(raw)
      .join(',')
      .split(',')
      .filter((value, index, self) => self.indexOf(value) === index)
  }

  getRole(email: string): void {
    this.roleService.getRole(email).subscribe(role =>
      this.currRole = role)
  }

  onAdd(): void {
    const role = {
      id: 0,
      role: {
        id: 0,
        description: this.newRoleForm.value.role!
      },
      roleAccess: {
        id: 0,
        permission: this.newRoleForm.value.permission!
      }
    }
  }

  onDelete(): void {
    this.roleService.deleteRole(this.newRoleForm.value.role!, this.newRoleForm.value.permission!).subscribe({
      next: (data) => {
        this.deleted = true
      },
      error: (error) => {
        this.failed = true
      }
    })
  }
}