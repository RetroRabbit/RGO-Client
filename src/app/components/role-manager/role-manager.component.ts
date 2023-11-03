import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { Employee } from 'src/app/models/employee.interface';
import { EmployeeRoleService } from 'src/app/services/employee/employee-role.service';
import { EmployeeService } from 'src/app/services/employee/employee.service';
import { RoleService } from 'src/app/services/role.service';
import { RoleAccess } from 'src/app/models/role-access-interface';
import { Role } from 'src/app/models/role.interface';
import { MatDialog } from '@angular/material/dialog';




@Component({
  selector: 'app-role-manager',
  templateUrl: './role-manager.component.html',
  styleUrls: ['./role-manager.component.css'],
})
export class RoleManagerComponent {
  @Input() goto: 'dashboard' | 'employees' = 'dashboard';
  @ViewChild('dialogContentTemplate') dialogContentTemplate!: TemplateRef<any>;
  roles$: Observable<string[]> = this.employeeRoleService.getAllRoles()
  employees$: Observable<Employee[]> = this.employeeService.getAll()
  roleAccesses$: Observable<Map<string, string[]>> = this.roleService.getAllRoles();

  saved: boolean = false
  deleted: boolean = false
  failed: boolean = false
  selected: boolean = false

  currRole!: Map<string, string[]>

  newRoleForm = new FormGroup({
    role: new FormControl('', Validators.required),
    permission: new FormControl('', Validators.required),
  })


 
  // roles: Role[] = [];
  // roleAccesses: RoleAccess[] = [];

  title = 'toolsets';
  parentSelector: boolean = false;

  roleAccessLink = [
    { id: 1, roleId:1, roleAccessId: 1, },
    { id: 2, roleId:1, roleAccessId: 2, },
    { id: 3, roleId:1, roleAccessId: 2, },
    { id: 4, roleId:1, roleAccessId: 8, },
    { id: 5, roleId:1, roleAccessId: 5, },
    { id: 6, roleId:1, roleAccessId: 6, },
    { id: 7, roleId:1, roleAccessId: 7,},
    { id: 8, roleId:1, roleAccessId: 8, }, 
  ];

  roles= [
    {id:1, description:"SuperAdmin"},
    {id:2, description:"Admin"},
    {id:3, description:"Employee"},
    {id:4, description:"Talent"}
  ];

  permissionTag =[{
    id:1, description:"Charts",parentSelector:true,
  }]
  roleAccess = [
    { id: 1, description: "ViewEmployee" },
    { id: 2, description: "AddEmployee" },
    { id: 3, description: "EditEmployee" },
    { id: 4, description: "DeleteEmployee" },
    { id: 5, description: "ViewChart" },
    { id: 6, description: "AddChart" },
    { id: 7, description: "EditChart" },
    { id: 8, description: "DeleteChart" },
    { id: 9, description: "ViewOwnInfo" },
    { id: 10, description: "EditOwnInfo" }
];

chartsPermissions = this.roleAccess.filter(permission => permission.description.includes("Chart"));

 

  onChangeRoleAccess($event: any, role: string, permission: string) {
    
     console.log(role,permission)
     console.log($event);
    var isChecked = $event.source.checked;
    if(isChecked){
      
      this.onAdd(role,permission);
    }
    else{
      this.onDelete(role,permission);
    }

  }
  
  constructor(
    private roleService: RoleService,
    private employeeService: EmployeeService,
    private employeeRoleService: EmployeeRoleService,
    private cookieService: CookieService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    // this.employeeRoleService.getAllRoles().subscribe(roles => {
    //   this.roles = roles;
    // });

    // this.employeeRoleService.getAllRoles().subscribe(roleAccess => {
    //  this.roleAccesses = roleAccess
    // });
  }

  getRoles(raw: Map<string, string[]>): string[] {
    return Object.keys(raw)
  }

  changePermission(role:string, permission: string): void {
    this.newRoleForm.setValue({ role: role, permission: permission })
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

  onAdd(role:string,permission:string): void {
    this.roleService.addRole(role, permission).subscribe({
      next: (data) => {
        this.saved = true
      },
      error: (error) => {
        this.failed = true
      }
    })
  }

  onDelete(role:string,permission:string): void {
    this.roleService.deleteRole(role, permission).subscribe({
      next: (data) => {
        this.deleted = true
      },
      error: (error) => {
        this.failed = true
      }
    })
  }

  openDialog(): void {
    console.log("hello")
    const dialogRef = this.dialog.open(this.dialogContentTemplate);

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        console.log('Delete action confirmed');
      }
    });
  }
}
