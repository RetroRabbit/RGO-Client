export interface ReportAccessRequest {
    reportId: number;
    access: ReportAccessRequestItem[];
}

export interface ReportAccessRequestItem {
    employeeId: number;
    roleId?: number;
    viewOnly: boolean;
}