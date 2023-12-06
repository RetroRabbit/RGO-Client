import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { RoleService } from 'src/app/services/role.service';
import { RoleAccess } from 'src/app/models/role-access.interface';
import { Role } from 'src/app/models/role.interface';
import { MatDialog } from '@angular/material/dialog';
import { RoleAccessLink } from 'src/app/models/role-access-link.interface';
import { RoleManagementService } from 'src/app/services/role-management.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { forkJoin } from 'rxjs';
import { Dialog } from 'src/app/models/confirm-modal.interface';
@Component({
  selector: 'app-role-manager',
  templateUrl: './role-manager.component.html',
  styleUrls: ['./role-manager.component.css'],
})
export class RoleManagerComponent implements OnInit {

  saved: boolean = false
  deleted: boolean = false
  failed: boolean = false
  selected: boolean = false

  roles: Role[] = [];

  roleAccesses: RoleAccess[] = [];

  roleAccessLinks: RoleAccessLink[] = [];

  chartPermissions: RoleAccess[] = [];

  employeePermissions: RoleAccess[] = [];

  temporaryRoleAccessChanges: RoleAccessLink[] = [];

  parentSelector: boolean = false;

  showConfirmDialog: boolean = false;
  dialogTypeData: Dialog = { type: '', title: '', subtitle: '', confirmButtonText: '', denyButtonText: ''  };
  constructor(
    private roleManagementService: RoleManagementService,
    private roleService: RoleService,
    private dialog: MatDialog,
    private snackBarService: SnackbarService
  ) { }

  ngOnInit() {
    forkJoin([
      this.roleManagementService.getAllRoles(),
      this.roleManagementService.getAllRoleAccesses(),
      this.roleManagementService.getAllRoleAccesssLinks()
    ]).subscribe(([roles, roleAccess, roleAccessLinks]) => {
      this.roles = roles;
      this.roleAccesses = roleAccess;
      this.chartPermissions = this.roleAccesses.filter(permission => permission.grouping === "Charts");
      this.employeePermissions = this.roleAccesses.filter(permission => permission.grouping === "Employee Data");
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

  toggleAllCheckboxes(roleDescription: string, event: any) {
    for (let n of this.chartPermissions) {
      const key = roleDescription + n.permission;
      this.checkboxStates[key] = this.allCheckboxesState[roleDescription];
  
      const existingChangeIndex = this.temporaryRoleAccessChanges.findIndex((item) =>
        item.role.description === roleDescription &&
        item.roleAccess.permission === n.permission &&
        item.roleAccess.grouping === n.grouping
      );
  
      if (this.allCheckboxesState[roleDescription]) {
        if (existingChangeIndex === -1) {
          const existingLink = this.roleAccessLinks.find(link =>
            link.role.description === roleDescription &&
            link.roleAccess.permission === n.permission &&
            link.roleAccess.grouping === n.grouping
          );
  
          const newChange = {
            id: existingLink ? existingLink.id : -1,
            role: { id: -1, description: roleDescription },
            roleAccess: { id: -1, permission: n.permission, grouping: n.grouping },
            changeType: event.checked ? 'add' : 'delete',
          };
  
          if (newChange.id === -1) {
            this.temporaryRoleAccessChanges.push(newChange);
          }
        } else {
          this.temporaryRoleAccessChanges[existingChangeIndex].changeType = event.checked ? 'add' : 'delete';
        }
      } else {
        if (existingChangeIndex === -1) {
          const newChange = {
            id: -1,
            role: { id: -1, description: roleDescription },
            roleAccess: { id: -1, permission: n.permission, grouping: n.grouping },
            changeType: event.checked ? 'add' : 'delete',
          };
  
          if (newChange.id === -1) {
            this.temporaryRoleAccessChanges.push(newChange);
          }
        } else {
          this.temporaryRoleAccessChanges[existingChangeIndex].changeType = event.checked ? 'add' : 'delete';
        }
      }
    }
  }
  
  toggleAllEmployeeDataCheckboxes(roleDescription: string, event: any) {
    for (let n of this.employeePermissions) {
      const key = roleDescription + n.permission;
      this.checkboxStatesEmployeePermissions[key] = this.allEmployeeDataCheckboxesState[roleDescription];
  
      const existingChangeIndex = this.temporaryRoleAccessChanges.findIndex((item) =>
        item.role.description === roleDescription &&
        item.roleAccess.permission === n.permission &&
        item.roleAccess.grouping === n.grouping
      );
  
      if (this.allEmployeeDataCheckboxesState[roleDescription]) {
        if (existingChangeIndex === -1) {
          const existingLink = this.roleAccessLinks.find(link =>
            link.role.description === roleDescription &&
            link.roleAccess.permission === n.permission &&
            link.roleAccess.grouping === n.grouping
          );
  
          const newChange = {
            id: existingLink ? existingLink.id : -1,
            role: { id: -1, description: roleDescription },
            roleAccess: { id: -1, permission: n.permission, grouping: n.grouping },
            changeType: event.checked ? 'add' : 'delete',
          };
  
          if (newChange.id === -1) {
            this.temporaryRoleAccessChanges.push(newChange);
          }
        } else {
          this.temporaryRoleAccessChanges[existingChangeIndex].changeType = event.checked ? 'add' : 'delete';
        }
      } else {
        if (existingChangeIndex === -1) {
          const newChange = {
            id: -1,
            role: { id: -1, description: roleDescription },
            roleAccess: { id: -1, permission: n.permission, grouping: n.grouping },
            changeType: event.checked ? 'add' : 'delete',
          };
  
          if (newChange.id === -1) {
            this.temporaryRoleAccessChanges.push(newChange);
          }
        } else {
          this.temporaryRoleAccessChanges[existingChangeIndex].changeType = event.checked ? 'add' : 'delete';
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

  saveChanges() {
    this.temporaryRoleAccessChanges.forEach((change) => {
      if (change.changeType === 'add') {
        this.onAdd(change.role.description, change.roleAccess.permission, change.roleAccess.grouping);
      } else if (change.changeType === 'delete') {
        this.onDelete(change.role.description, change.roleAccess.permission, change.roleAccess.grouping);
      }
    });
    this.temporaryRoleAccessChanges = [];
    this.snackBarService.showSnackbar("Permissions updated successfully", "snack-success");
  }

  discardChanges() {
    this.ngOnInit();
    this.snackBarService.showSnackbar("Changes discarded successfully", "snack-success");
  }

  onAdd(role:string,permission:string,grouping: string): void {
    this.roleService.addRole(role, permission,grouping).subscribe({
      next: (data) => {
        this.saved = true
      },
      error: (error) => {
        this.failed = true
        this.snackBarService.showSnackbar("Failed to updated permissions", "snack-error");
      }
    })
  }

  onDelete(role: string, permission: string, grouping: string): void {
    this.roleService.deleteRole(role, permission, grouping).subscribe({
      next: (data) => {
        this.deleted = true;
      },
      error: (error) => {
        this.snackBarService.showSnackbar("Failed to delete permissions", "snack-error");
        this.deleted = true
      },
    })
  }

  openDialog(): void {
    this.dialogTypeData = { type: 'save', title: 'Save Permissions', subtitle: 'Are you sure you want to save the permissions that you edited?', confirmButtonText: 'Save', denyButtonText: 'Back' }
    this.showConfirmDialog = true;
  }

  dialogFeedBack(event: any) {
    this.showConfirmDialog = false;
    if (event) {
      this.saveChanges();
    } else {
      this.discardChanges();
    }
  }
}
