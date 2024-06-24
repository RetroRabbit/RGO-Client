export interface ReportColumnRequest {
    id: number;
    reportId: number;
    menuId: number;
    sequence: number;
    customType?: string;
    name: string;
}
