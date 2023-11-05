import { Component, Input, Inject, ElementRef, ViewChild, AfterViewInit} from '@angular/core';
import { ChartService } from 'src/app/services/charts.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';


@Component({
  selector: 'app-chart-report-pdf',
  templateUrl: './chart-report-pdf.component.html',
  styleUrls: ['./chart-report-pdf.component.css']
})
export class ChartReportPdfComponent {
  @Input() inputchartData !: { selectedChart: any; canvasData: any; };
  activeChart: any = null;
  showReport: boolean = false;
  clearActiveChart: () => void = () => { };
  public pieChartPlugins = [ChartDataLabels];
  public barChartPlugins = [ChartDataLabels];
  @ViewChild('chartContainer') chartContainer!: ElementRef;
  @ViewChild('reportContent') reportContent!: ElementRef;
  @ViewChild('canvas') canvas: ElementRef = {} as ElementRef;

  ngOnInit(){
  }
  constructor(@Inject(MAT_DIALOG_DATA) public chartData: any, private chartService: ChartService) {
  }

  ngAfterViewInit() {
    // Now you can access this.canvas.nativeElement
    const context: CanvasRenderingContext2D = this.canvas.nativeElement.getContext('2d');
  }

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      x: {},
      y: {
        min: 0,
      },
    },
    plugins: {
      legend: {
        display: true,
      },
      datalabels: {
        anchor: 'middle',
        align: 'middle',
      } as any,
    },
  };


  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
  };

  generateReport(): void {
    const reportHTML = this.generateHTMLReport();
    const newWindow = window.open();
    if (newWindow) {
      newWindow.document.open();
      newWindow.document.write(reportHTML);
      newWindow.document.close();
    }
  }
  generateHTMLReport(): string {
    const chartHTML = `<h1>${this.chartData.selectedChart.label}</h1>`;
    const dataHTML = `<p>Data: ${JSON.stringify(this.chartData.selectedChart.data)}</p>`;
    return `<html><body>${chartHTML}${dataHTML}</body></html>`;
  }

  getTotalEmployees(): number {
    return this.chartData.selectedChart.data.reduce((total: number, value: number) => total + value, 0);
  }

  calculatePercentage(value: number): string {
    const total: number = this.getTotalEmployees();
    const percentage: number = (value / total) * 100;
    return percentage.toFixed(2);
  }

//   downloadReportAsPDF() {
//     const container = document.querySelector(".container") as HTMLElement;
//     html2canvas(container).then(canvas => {
//         const imgData = canvas.toDataURL('image/png');
//         const pdf = new jsPDF('p', 'mm', 'a4');
//         const imgProps = pdf.getImageProperties(imgData);
//         const pdfWidth = pdf.internal.pageSize.getWidth();
//         const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
//         pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
//         pdf.save('report.pdf');
//     });
// }

//  downloadReportAsPDF() {
//   const container = document.querySelector(".container") as HTMLElement;
//   html2canvas(container, {scrollY: -window.scrollY}).then(canvas => {
//       const imgData = canvas.toDataURL('image/png');
//       const pdf = new jsPDF('p', 'mm', 'a4');
//       const pdfWidth = pdf.internal.pageSize.getWidth();
//       const pdfHeight = pdf.internal.pageSize.getHeight();
//       const imgProps = pdf.getImageProperties(imgData);
//       const imgWidth = pdfWidth;
//       const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

//       let heightLeft = imgHeight;

//       let position = 0;

//       pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
//       heightLeft -= pdfHeight;

//       // Add new pages if the content overflows
//       while (heightLeft >= 0) {
//           position = heightLeft - imgHeight;
//           pdf.addPage();
//           pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
//           heightLeft -= pdfHeight;
//       }

//       pdf.save('report.pdf');
//   });
// }

// downloadReportAsPDF(): void {
//   const chartElement = this.chartContainer.nativeElement;
//   const contentElement = this.reportContent.nativeElement;

//   // First, capture the chart with html2canvas
//   html2canvas(chartElement).then((canvas) => {
//     const chartDataUrl = canvas.toDataURL('image/png');

//     // Then, initialize jsPDF and add the chart image
//     const pdf = new jsPDF('p', 'mm', 'a4');
//     const pdfWidth = pdf.internal.pageSize.getWidth();
//     const imgProps = pdf.getImageProperties(chartDataUrl);
//     const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
//     pdf.addImage(chartDataUrl, 'PNG', 0, 0, pdfWidth, imgHeight);

//     var contentYPosition = imgHeight + 10; // Add a small margin

//     // Clone the node to manipulate and remove the chart for PDF generation
//     const clonedContentElement = contentElement.cloneNode(true) as HTMLElement;
//     clonedContentElement.querySelector('#edit-chart-container')?.remove();

//     // Convert the cloned content without the chart to a data URL for jsPDF
//     html2canvas(clonedContentElement).then((contentCanvas) => {
//       const contentDataUrl = contentCanvas.toDataURL('image/png');
//       const contentImgProps = pdf.getImageProperties(contentDataUrl);
//       const contentImgHeight = (contentImgProps.height * pdfWidth) / contentImgProps.width;

//       // Check if content fits on one page, split it if it doesn't
//       let remainingHeight = contentImgHeight;
//       let position = 0;

//       while (remainingHeight > 0) {
//         const pageHeight = pdf.internal.pageSize.getHeight();
//         const sliceHeight = Math.min(remainingHeight, pageHeight - contentYPosition);
//         const sliceWidth = sliceHeight * (contentImgProps.width / contentImgProps.height);

//         if (position !== 0) {
//           pdf.addPage();
//         }

//         pdf.addImage(contentDataUrl, 'PNG', 0, contentYPosition, pdfWidth, sliceHeight, '', 'FAST');

//         remainingHeight -= sliceHeight;
//         position += sliceHeight;

//         // Ensure new page starts at the top position
//         contentYPosition = 0;
//       }

//       // Save the PDF
//       pdf.save('report.pdf');
//     });
//   });
// }

// downloadReportAsPDF() {
//   // Ensure the full container content is captured
//   const container = document.querySelector(".container") as HTMLElement;

//   // Store the current styles if you need to revert back later
//   const originalStyles = {
//     width: container.style.width,
//     height: container.style.height,
//     overflow: container.style.overflow
//   };

//   // Temporarily change the styles to display all content
//   container.style.width = 'auto';
//   container.style.height = 'auto';
//   container.style.overflow = 'visible';

//   // After the styles are adjusted, we can capture the canvas
//   html2canvas(container, { scale: 1, useCORS: true }).then(canvas => {
//     // Reset the container to its original styles
//     Object.assign(container.style, originalStyles);

//     const imgData = canvas.toDataURL('image/png');
//     const pdf = new jsPDF('p', 'mm', 'a4');
//     const imgProps = pdf.getImageProperties(imgData);
//     const pdfWidth = pdf.internal.pageSize.getWidth();
//     const pdfHeight = pdfWidth * (imgProps.height / imgProps.width);

//     // Check if the content fits on one page
//     if (pdfHeight <= pdf.internal.pageSize.getHeight()) {
//       pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
//     } else {
//       // Content spans over multiple pages
//       let heightLeft = imgProps.height;
//       let position = 0;

//       while (heightLeft >= 0) {
//         pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdf.internal.pageSize.getHeight());
//         heightLeft -= pdf.internal.pageSize.getHeight();
//         position -= pdf.internal.pageSize.getHeight();

//         // Add new page if there's more content to add
//         if (heightLeft > 0) {
//           pdf.addPage();
//         }
//       }
//     }

//     pdf.save('report.pdf');
//   });
// }

// downloadReportAsPDF() {
//   const container = document.querySelector(".container") as HTMLElement;

//   // Capture the full container, not just the visible part
//   html2canvas(container, {
//     scale: 1,
//     useCORS: true,
//     scrollY: -window.scrollY,
//     scrollX: 0,
//     windowHeight: container.scrollHeight,
//     windowWidth: container.scrollWidth,
//   }).then(canvas => {
//     const imgData = canvas.toDataURL('image/png');
//     const pdf = new jsPDF('p', 'mm', 'a4');
//     const imgProps = pdf.getImageProperties(imgData);
//     const pdfWidth = pdf.internal.pageSize.getWidth();
//     const pdfHeight = pdfWidth * (imgProps.height / imgProps.width);

//     // Determine how many pages will be needed to draw the entire content
//     const pages = Math.ceil(imgProps.height / pdf.internal.pageSize.getHeight());
//     let heightLeft = imgProps.height;
//     let position = 0;

//     // Add content to each page
//     for (let i = 0; i < pages; i++) {
//       // If not the first page, add a new page
//       if (i > 0) {
//         pdf.addPage();
//         position = pdf.internal.pageSize.getHeight() * i;
//       }
//       pdf.addImage(imgData, 'PNG', 0, -position, pdfWidth, pdfHeight);
//     }

//     pdf.save('report.pdf');
//   });
// }

// downloadReportAsPDF() {
//   const container = document.querySelector(".container") as HTMLElement;

//   html2canvas(container, {
//     scale: 1,
//     useCORS: true,
//     scrollY: 0,
//     scrollX: 0,
//     windowHeight: container.scrollHeight,
//     windowWidth: container.scrollWidth
//   }).then(canvas => {
//     const imgData = canvas.toDataURL('image/png');
//     const pdf = new jsPDF('p', 'mm', 'a4');
//     const pdfWidth = pdf.internal.pageSize.getWidth();
//     const pdfHeight = pdf.internal.pageSize.getHeight();
//     const imgProps = pdf.getImageProperties(imgData);
//     const imgWidth = pdfWidth;
//     const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
//     let heightLeft = imgHeight;
//     let position = 0;

//     // Add the first page
//     pdf.addImage(imgData, 'PNG', 0, position, imgWidth, pdfHeight);
//     heightLeft -= pdfHeight;

//     // Add additional pages if the content is longer than one page
//     while (heightLeft >= 0) {
//       position = heightLeft - imgHeight;
//       pdf.addPage();
//       pdf.addImage(imgData, 'PNG', 0, position, imgWidth, pdfHeight);
//       heightLeft -= pdfHeight;
//     }

//     pdf.save('report.pdf');
//   });
// }

// downloadReportAsPDF() {
//   const element = document.querySelector('.container'); // The DOM element you want to capture

//   // Options for html2pdf
//   const options = {
//     margin:       10,
//     filename:     'report.pdf',
//     image:        { type: 'jpeg', quality: 0.98 },
//     html2canvas:  { scale: 2, logging: true, dpi: 192, letterRendering: true },
//     jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
//   };

//   // Use html2pdf to convert the element
//   html2pdf().from(element).set(options).save();
// }

downloadReportAsPDF() {
  // Retrieve the container element
  const container = document.querySelector(".container") as HTMLElement;

  if (container) {
    // Save the original style
    const originalStyle = container.getAttribute("style");

    // Temporarily change the necessary styles
    container.style.height = 'fit-content';

    // Capture the container with html2canvas
    html2canvas(container).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      // Add the image to the PDF
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

      // Save the PDF
      pdf.save('report.pdf');

      // Revert the container's style back to its original
      if (originalStyle !== null) {
        container.setAttribute("style", originalStyle);
      } else {
        container.removeAttribute("style");
      }
    }).catch(error => {
      console.error('Error generating PDF:', error);
      // Revert the container's style back to its original even if there was an error
      if (originalStyle !== null) {
        container.setAttribute("style", originalStyle);
      } else {
        container.removeAttribute("style");
      }
    });
  } else {
    console.error("Could not find the container element to generate the PDF.");
  }
}

downloadReportAsCSV(dataTypes: string[]) {

  this.chartService.downloadCSV(dataTypes).subscribe(data => {
    const blob = new Blob([data], { type: 'text/csv' });
    const downloadLink = document.createElement('a');
    downloadLink.href = window.URL.createObjectURL(blob);
    downloadLink.download = 'Report.csv';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  });
}
}
