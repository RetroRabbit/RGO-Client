import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Employee } from 'src/app/models/employee.interface';
import { EmployeeRoleService } from 'src/app/services/employee/employee-role.service';
import { EmployeeService } from 'src/app/services/employee/employee.service';
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


 
  displayedColumns: string[] = [];
  permisssionRows: string[] = [];

  title = 'toolsets';
  parentSelector: boolean = false;

  roleAccessLink = [
    { id: 5, roleId:1, roleAccessId: 5, selected: false},
    { id: 6, roleId:1, roleAccessId: 6, selected: false},
    { id: 7, roleId:1, roleAccessId: 7, selected: true},
    { id: 8, roleId:1, roleAccessId: 8, selected: false}, 
  ];

  roles= [
    {id:1, description:"SuperAdmin"},
    {id:2, description:"Admin"},
    {id:2, description:"Employee"},
    {id:2, description:"Talent"}
  ];

  permissionTag =[{
    id:1, description:"Charts",parentSelector:true,
  }]

  roleAccess = [
    {id:1, description:"ViewEmployee",tag: "Employee Data"},
    {id:2, description:"AddEmployee",tag: "Employee Data"},
    {id:3, description:"EditEmployee",tag: "Employee Data"},
    {id:4, description:"DeleteEmployee",tag: "Employee Data"},
    {id:5, description:"ViewChart",tag: "Charts"},
    {id:6, description:"AddChart",tag: "Charts"},
    {id:7, description:"EditChart",tag: "Charts"},
    {id:8, description:"DeleteChart",tag: "Charts"},
    {id:9, description:"ViewOwnInfo",tag: "Employee Data"},
    {id:10, description:"EditOwnInfo",tag: "Employee Data"}
  ]

  chartsPermissions = this.roleAccess.filter(permission => permission.tag === "Charts");

  food = [
    { id: 1, select: false, name: 'dumpling' },
    { id: 2, select: true, name: 'burger' },
    { id: 3, select: true, name: 'sandwich' },
  ];

  onChangeFood($event: any) {
    const id = $event.source.value;
    const isChecked = $event.source.checked;

    this.roleAccessLink = this.roleAccessLink.map((d) => {
      if (d.id == id) {
        d.selected = isChecked;
        this.parentSelector = false;
        return d;
      }
      if (id == -1) {
        d.selected = this.parentSelector;
        return d;
      }
      return d;
    });
    console.log(this.roleAccessLink);
  }
  
  constructor(
    private roleService: RoleService,
    private employeeService: EmployeeService,
    private employeeRoleService: EmployeeRoleService
  ) { }

  ngOnInit() {
    this.employeeRoleService.getAllRoles().subscribe(roles => {
      this.displayedColumns = roles;
    });
  }

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
    this.roleService.getRole(selectedRole).subscribe({
      next: role =>
      this.currRole = role
    })
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
