import { Component, Input } from '@angular/core';
import { RoleService } from 'src/app/services/role.service';
import { RoleAccess } from 'src/app/models/role-access.interface';
import { Role } from 'src/app/models/role.interface';
import { RoleAccessLink} from 'src/app/models/role-access-link.interface';
import { RoleManagementService } from 'src/app/services/role-management.service';
import { NgToastService } from 'ng-angular-popup';

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

  temporaryRoleAccessChanges: RoleAccessLink[] = [];


  
  parentSelector: boolean = false;

  constructor(
    private roleManagementService: RoleManagementService,
    private roleService: RoleService,
    private toast: NgToastService
  ) { }

  
  ngOnInit() {
    this.roleManagementService.getAllRoles().subscribe(roles => {
      this.roles = roles;
    });
    
    this.roleManagementService.getAllRoleAccesssLinks().subscribe(roleAccessLinks => {
      this.roleAccessLinks = roleAccessLinks ;
    });

    this.roleManagementService.getAllRoleAccesses().subscribe(roleAccess => {
     this.roleAccesses = roleAccess
     this.chartPermissions = this.roleAccesses.filter(permission => permission.grouping === "Charts");

    });
  }

  saveChanges() {
    this.temporaryRoleAccessChanges.forEach((change) => {
      if (change.changeType === 'add') {
        this.onAdd(change.role.description, change.roleAccess.permission, change.roleAccess.grouping);
      } else if (change.changeType === 'delete') {
        this.onDelete(change.role.description, change.roleAccess.permission, change.roleAccess.grouping);
      }
    });
  
    // Reset the temporaryRoleAccessChanges array after processing all changes
    this.temporaryRoleAccessChanges = [];
  }
  
  
  onChangeRoleAccess($event: any, role: string, permission: string, grouping: string) {
    const isChecked = $event.source.checked;
  
    const change: RoleAccessLink = {
      id: -1,
      role: {
        id: -1,
        description: role,
      },
      roleAccess: {
        id: -1,
        permission: permission,
        grouping: grouping,
      },
      changeType: isChecked ? 'add' : 'delete',
    };
  
    // Check if the change already exists in the array and remove it
    const existingChangeIndex = this.temporaryRoleAccessChanges.findIndex((item) =>
      item.role.description === role && item.roleAccess.permission === permission && item.roleAccess.grouping === grouping
    );
  
    if (existingChangeIndex !== -1) {
      this.temporaryRoleAccessChanges.splice(existingChangeIndex, 1);
    }
  
    // Push the new change to the array
    this.temporaryRoleAccessChanges.push(change);
  }
  
  
  onAdd(role:string,permission:string,grouping: string): void {
    this.roleService.addRole(role, permission,grouping).subscribe({
      next: (data) => {
        this.toast.success({
          detail: `RoleAccess saved  successfully!`,
          summary: 'Success',
          duration: 5000,
          position: 'topRight',
        });
        this.saved = true
      },
      error: (error) => {
        this.failed = true
      }
    })
  }

  onDelete(role:string,permission:string,grouping: string): void {
    this.roleService.deleteRole(role, permission,grouping).subscribe({
      next: (data) => {
        this.toast.success({
          detail: `RoleAccessLink deleted  successfully!`,
          summary: 'Success',
          duration: 5000,
          position: 'topRight',
        });
        this.deleted = true
      },
      error: (error) => {
        this.toast.error({
          detail: `Error: ${error}`,
          summary: 'Failed to delete roleAccessLink',
          duration: 10000,
          position: 'topRight',
        });
        this.failed = true
      }
    })
  }
}
