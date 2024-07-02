import { AccessList } from "./data-report-access.interface";
import { DataReportColumns } from "./data-report-columns.interface";

export interface DataReport {
    reportName?: string,
    reportId?: number,
    columns?: DataReportColumns[],
    data?: any[],
    reportCode?: string,
    viewOnly?: boolean,
    accessList?: AccessList[]
}