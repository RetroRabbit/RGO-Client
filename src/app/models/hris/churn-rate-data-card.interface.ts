export class ChurnRateDataCard {

  ChurnRateDataCard() {
    this.churnRate = 0;
    this.developerChurnRate = 0;
    this.designerChurnRate = 0;
    this.scrumMasterChurnRate = 0;
    this.businessSupportChurnRate = 0;
    this.month = "";
    this.year = 0;
    this.churnRateDifference = 0;
    this.isIncrease = false;
  }

  churnRate?: number;
  developerChurnRate?: number;
  designerChurnRate?: number;
  scrumMasterChurnRate?: number;
  businessSupportChurnRate?: number;
  month?: string;
  year?: number;
  churnRateDifference?: number;
  isIncrease? : boolean;
}
