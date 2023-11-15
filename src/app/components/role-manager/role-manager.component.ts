import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { RoleService } from 'src/app/services/role.service';
import { RoleAccess } from 'src/app/models/role-access.interface';
import { Role } from 'src/app/models/role.interface';
import { MatDialog } from '@angular/material/dialog';
import { RoleAccessLink} from 'src/app/models/role-access-link.interface';
import { RoleManagementService } from 'src/app/services/role-management.service';
import { NgToastService } from 'ng-angular-popup';
import { EmployeeService } from 'src/app/services/employee/employee.service';
import { EmployeeRoleService } from 'src/app/services/employee/employee-role.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-role-manager',
  templateUrl: './role-manager.component.html',
  styleUrls: ['./role-manager.component.css'],
})
export class RoleManagerComponent {

  @ViewChild('dialogContentTemplate') dialogContentTemplate!: TemplateRef<any>;
 
  @ViewChild('dialogCancelTemplate') dialogCancelTemplate!: TemplateRef<any>;
  
  saved: boolean = false
  deleted: boolean = false
  failed: boolean = false
  selected: boolean = false

  roles: Role[] = [];
  
  roleAccesses: RoleAccess[] = [];

  roleAccessLinks: RoleAccessLink[] = [];

  chartPermissions :RoleAccess[] = [];

  employeePermissions :RoleAccess[] = [];

  temporaryRoleAccessChanges: RoleAccessLink[] = [];

  parentSelector :boolean = false;
  constructor(
    private roleManagementService: RoleManagementService,
    private roleService: RoleService,
    private dialog: MatDialog,
    private toast: NgToastService
  ) { }

  ngOnInit() {
    this.roleManagementService.getAllRoles().subscribe(roles => {
      this.roles = roles;
    });
  
    this.roleManagementService.getAllRoleAccesses().subscribe(roleAccess => {
      this.roleAccesses = roleAccess;
      this.chartPermissions = this.roleAccesses.filter(permission => permission.grouping === "Charts");
      this.employeePermissions = this.roleAccesses.filter(permission => permission.grouping === "Employee Data");
    });
  
    this.roleManagementService.getAllRoleAccesssLinks().subscribe(roleAccessLinks => {
      this.roleAccessLinks = roleAccessLinks;
      this.updateChartAndEmployeeDataCheckboxStates();
    });
  }
  

  areAllCheckboxesSelected(columnKey: string): boolean {
    return this.roles.every((r) => this.checkboxStates[r.description + columnKey]);
  }

   updateAllCheckboxes() {
    for (let role of this.roles) {
      const hasLinks = this.chartPermissions.every((n) =>
        this.roleAccessLinks.some((link) =>
          link.role.description === role.description &&
          link.roleAccess.permission === n.permission &&
          link.roleAccess.grouping === n.grouping
        )
      );
      this.allCheckboxesState[role.description] = hasLinks;
    }
  }

  areAllEmployeeDataCheckboxesSelected(columnKey: string): boolean {
    return this.roles.every((r) => this.checkboxStatesEmployeePermissions[r.description + columnKey]);
  }

updateAllEmployeeDataCheckboxes() {
  for (let r of this.roles) {
    const hasLinks = this.employeePermissions.every((n) =>
      this.roleAccessLinks.some((link) =>
        link.role.description === r.description &&
        link.roleAccess.permission === n.permission &&
        link.roleAccess.grouping === n.grouping
      )
    );
    this.allEmployeeDataCheckboxesState[r.description] = hasLinks;
  }
}

  
  updateChartAndEmployeeDataCheckboxStates() {
    for (let r of this.roles) {
      for (let n of this.chartPermissions) {
        const key = r.description + n.permission;
        const existingLink = this.roleAccessLinks.find(link =>
          link.role.description === r.description &&
          link.roleAccess.permission === n.permission &&
          link.roleAccess.grouping === n.grouping
        );
        this.checkboxStates[key] = existingLink ? true : false;
      }
      for (let n of this.employeePermissions) {
        const key = r.description + n.permission;
        const existingLink = this.roleAccessLinks.find(link =>
          link.role.description === r.description &&
          link.roleAccess.permission === n.permission &&
          link.roleAccess.grouping === n.grouping
        );
        this.checkboxStatesEmployeePermissions[key] = existingLink ? true : false;
      }
    }
    this.updateAllCheckboxes();
    this.updateAllEmployeeDataCheckboxes();
  }
  
allCheckboxesState: { [key: string]: boolean } = {};

allEmployeeDataCheckboxesState: { [key: string]: boolean } = {}

checkboxStates: { [key: string]: boolean } = {};

checkboxStatesEmployeePermissions: { [key: string]: boolean } = {};

toggleAllCheckboxes(roleDescription: string) {
  for (let n of this.chartPermissions) {
    const key = roleDescription + n.permission;
    this.checkboxStates[key] = this.allCheckboxesState[roleDescription];
    const existingChangeIndex = this.temporaryRoleAccessChanges.findIndex((item) =>
      item.role.description === roleDescription && item.roleAccess.permission === n.permission && item.roleAccess.grouping === n.grouping
    );

    if (this.allCheckboxesState[roleDescription]) {
      if (existingChangeIndex === -1) {
        const existingLink = this.roleAccessLinks.find(link =>
          link.role.description === roleDescription &&
          link.roleAccess.permission === n.permission &&
          link.roleAccess.grouping === n.grouping
        );
        const changeType = existingLink ? 'delete' : 'add';
        this.temporaryRoleAccessChanges.push({
          id: existingLink ? existingLink.id : -1,
          role: { id: -1, description: roleDescription },
          roleAccess: { id: -1, permission: n.permission, grouping: n.grouping },
          changeType: changeType,
        });
      }
    } else {
      if (existingChangeIndex !== -1) {
        this.temporaryRoleAccessChanges[existingChangeIndex].changeType = 'delete';
      } else {
        this.temporaryRoleAccessChanges.push({
          id: -1,
          role: { id: -1, description: roleDescription },
          roleAccess: { id: -1, permission: n.permission, grouping: n.grouping },
          changeType: 'delete',
        });
      }
    }
  } 
}

toggleAllEmployeeDataCheckboxes(roleDescription: string) {
  for (let n of this.employeePermissions) {
    const key = roleDescription + n.permission;
    this.checkboxStatesEmployeePermissions[key] = this.allEmployeeDataCheckboxesState[roleDescription];
    const existingChangeIndex = this.temporaryRoleAccessChanges.findIndex((item) =>
      item.role.description === roleDescription && item.roleAccess.permission === n.permission && item.roleAccess.grouping === n.grouping
    );

    if (this.allEmployeeDataCheckboxesState[roleDescription]) {
      if (existingChangeIndex === -1) {
        this.temporaryRoleAccessChanges.push({
          id: -1,
          role: { id: -1, description: roleDescription },
          roleAccess: { id: -1, permission: n.permission, grouping: n.grouping },
          changeType: 'add',
        });
      }
    } else {
      if (existingChangeIndex !== -1) {
        this.temporaryRoleAccessChanges[existingChangeIndex].changeType = 'delete';
      } else {
        this.temporaryRoleAccessChanges.push({
          id: -1,
          role: { id: -1, description: roleDescription },
          roleAccess: { id: -1, permission: n.permission, grouping: n.grouping },
          changeType: 'delete',
        });
      }
    }
  }

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
  
    const existingChangeIndex = this.temporaryRoleAccessChanges.findIndex((item) =>
      item.role.description === role && item.roleAccess.permission === permission && item.roleAccess.grouping === grouping
    );
  
    if (existingChangeIndex !== -1) {
      this.temporaryRoleAccessChanges.splice(existingChangeIndex, 1);
    }
  
    this.temporaryRoleAccessChanges.push(change);
  }
  
  
  updateData() {
    this.roleManagementService.getAllRoleAccesssLinks().subscribe(roleAccessLinks => {
      this.roleAccessLinks = roleAccessLinks;
      this.updateChartAndEmployeeDataCheckboxStates();
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
 
    this.temporaryRoleAccessChanges = [];

  }

  discardChanges() {
    this.ngOnInit();
    this.toast.success({
      detail: `Changes discarded successfully!`,
      duration: 5000,
      position: 'topRight',
    });
  }
  
  onAdd(role:string,permission:string,grouping: string): void {
    this.roleService.addRole(role, permission,grouping).subscribe({
      next: (data) => {
        this.toast.success({
          detail: `Permissions saved  successfully!`,
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
          detail: `Permissions deleted  successfully!`,
          duration: 5000,
          position: 'topRight',
        });
        this.deleted = true
      },
      error: (error) => {
        this.toast.error({
          detail: `Error: ${error}`,
          summary: 'Failed to delete Permissions',
          duration: 10000,
          position: 'topRight',
        });
        this.failed = true
      }
    })
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(this.dialogContentTemplate);
     
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
      }
    });
  }

  onCancel(): void {
    const dialogRef = this.dialog.open(this.dialogCancelTemplate);
  }
}
