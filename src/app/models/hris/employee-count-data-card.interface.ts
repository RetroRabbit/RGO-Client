export class EmployeeCountDataCard {

    EmplpyeeCountDataCard() {
        this.devsCount = 0;
        this.designersCount = 0;
        this.scrumMastersCount = 0;
        this.businessSupportCount = 0;
        this.devsOnBenchCount = 0;
        this.designersOnBenchCount = 0;
        this.scrumMastersOnBenchCount = 0;
        this.totalNumberOfEmployeesOnBench = 0;
        this.billableEmployeesPercentage = 0;
        this.employeeTotalDifference = 0;
        this.totalNumberOfEmployeesOnClients = 0;
        this.isIncrease = false;
    }

    devsCount?: number;
    designersCount?: number;
    scrumMastersCount?: number;
    businessSupportCount?: number;
    devsOnBenchCount?: number;
    designersOnBenchCount?: number;
    scrumMastersOnBenchCount?: number;
    totalNumberOfEmployeesOnBench?: number;
    billableEmployeesPercentage?: number;
    employeeTotalDifference?: number;
    totalNumberOfEmployeesOnClients?: number;
    isIncrease?: boolean;
}