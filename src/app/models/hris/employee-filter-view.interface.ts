export class EmployeeFilterView { 

  EmployeeFilterView() {}

  id!: number;
  name!: string;
  surname!: string;
  level?: number;
  clientAllocated?: string;
  roleId!: string;
  roleDescription!: string;
  engagementDate?: Date;
  terminationDate?: Date;
  email?: string;
  inactiveReason?: string;
  position?: string;
}