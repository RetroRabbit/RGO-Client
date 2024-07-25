export interface DataReportFilter {
    ReportFilterId: number,
    employeeId: number,
    tableName: string,
    columnName: string,
    condition: string,
    value: string,
    reportId: number,
}