import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Employee } from 'src/app/models/employee.interface';
import { EmployeeRoleService } from 'src/app/services/employee-role.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { RoleService } from 'src/app/services/role.service';

@Component({
  selector: 'app-role-manager',
  templateUrl: './role-manager.component.html',
  styleUrls: ['./role-manager.component.css'],
})
export class RoleManagerComponent {
  roles$: Observable<string[]> = this.employeeRoleService.getAllRoles()
  employees$: Observable<Employee[]> = this.employeeService.getAll()
  roleAccesses$: Observable<Map<string, string[]>> = this.roleService.getAllRoles();

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
    private employeeService: EmployeeService,
    private employeeRoleService: EmployeeRoleService
  ) { }

  getRoles(raw: Map<string, string[]>): string[] {
    return Object.keys(raw)
  }

  changePermission(permission: string): void {
    this.newRoleForm.setValue({ role: this.newRoleForm.value.role ?? '', permission: permission })
  }

  changeRole(role: string): void {
    this.newRoleForm.setValue({ role: role, permission: this.newRoleForm.value.permission ?? '' })
    this.getRole(role)
  }

  getPermissions(roleAccess: Map<string, string[]>): string[] {
    return Object.values(roleAccess)
      .join(',')
      .split(',')
      .filter((value, index, self) => self.indexOf(value) === index)
  }

  getRole(selectedRole: string): void {
    this.roleService.getRole(selectedRole).subscribe(role =>
      this.currRole = role)
  }

  onAdd(): void {
    this.roleService.addRole(this.newRoleForm.value.role!, this.newRoleForm.value.permission!).subscribe({
      next: (data) => {
        this.saved = true
      },
      error: (error) => {
        this.failed = true
      }
    })
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
