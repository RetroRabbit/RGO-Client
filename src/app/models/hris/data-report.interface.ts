import { DataReportColumns } from "./data-report-columns.interface";

export interface DataReport {
    reportName?: string,
    reportId?: number,
    columns?: DataReportColumns[],
    data?: any[],
}