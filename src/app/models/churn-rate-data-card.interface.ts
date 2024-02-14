export class ChurnRateDataCard {

  ChurnRateDataCard() {
    this.churnRate = 0;
    this.developerChurnRate = 0;
    this.designerChurnRate = 0;
    this.scrumMasterChurnRate = 0;
    this.businessSupportChurnRate = 0;
    this.month = "";
    this.year = 0;
  }

  churnRate?: number;
  developerChurnRate?: number;
  designerChurnRate?: number;
  scrumMasterChurnRate?: number;
  businessSupportChurnRate?: number;
  month?: string;
  year?: number;
}
