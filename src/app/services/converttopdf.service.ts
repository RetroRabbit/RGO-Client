import { Injectable,Component, Input  } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Injectable({
  providedIn: 'root'
})
export class ConvertToPdfService {

  constructor() { }

  async captureAndConvertToPdf(element: HTMLElement): Promise<string> {
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

    const base64Pdf = pdf.output('datauristring');

    // Extract base64 data without the metadata
    const base64Data = base64Pdf.split(',')[1];
    return base64Data;
  }
}
