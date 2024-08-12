export interface DataReportFilter {
    id: number,
    table: string,
    column: string,
    condition: string,
    value: string,
    reportId: number,
    reportFilterName: string
}