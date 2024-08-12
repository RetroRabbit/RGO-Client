export interface ReportFilterRequest {
    tableName: string;
    columnName: string;
    condition: string;
    value: string;
    reportId: number;
    reportFilterName: string
}
