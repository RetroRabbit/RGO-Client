import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { Employee } from 'src/app/models/employee.interface';
import { EmployeeRoleService } from 'src/app/services/employee/employee-role.service';
import { EmployeeService } from 'src/app/services/employee/employee.service';
import { RoleService } from 'src/app/services/role.service';
import { RoleAccess } from 'src/app/models/role-access.interface';
import { Role } from 'src/app/models/role.interface';
import { RoleAccessLink} from 'src/app/models/role-access-link.interface';
import { RoleManagementService } from 'src/app/services/role-management.service';




@Component({
  selector: 'app-role-manager',
  templateUrl: './role-manager.component.html',
  styleUrls: ['./role-manager.component.css'],
})
export class RoleManagerComponent {
  @Input() goto: 'dashboard' | 'employees' = 'dashboard';
 
  saved: boolean = false
  deleted: boolean = false
  failed: boolean = false
  selected: boolean = false

 
  

  roles: Role[] = [];
  
  roleAccesses: RoleAccess[] = [];

  roleAccessLinks: RoleAccessLink[] = [];

  chartPermissions :RoleAccess[] = [];

  parentSelector: boolean = false;

  
  ngOnInit() {
    this.roleManagementService.getAllRoles().subscribe(roles => {
      this.roles = roles;
    });
    
    this.roleManagementService.getAllRoleAccesssLinks().subscribe(roleAccessLinks => {
      this.roleAccessLinks = roleAccessLinks ;
      console.log(this.roleAccessLinks);
    });

    this.roleManagementService.getAllRoleAccesses().subscribe(roleAccess => {
     this.roleAccesses = roleAccess
     this.chartPermissions = this.roleAccesses.filter(p=> p.permission.includes("Chart"));
    
     console.log(this.roleAccesses);
    });
  }



   

 

  onChangeRoleAccess($event: any, role: string, permission: string) {
    
    var isChecked = $event.source.checked;
    if(isChecked){
      
      this.onAdd(role,permission);
    }
    else{
      this.onDelete(role,permission);
    }

  }
  
  constructor(
    private roleManagementService: RoleManagementService,
    private roleService: RoleService,
  ) { }

  
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
}
