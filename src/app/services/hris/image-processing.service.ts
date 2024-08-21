import { Injectable } from '@angular/core';
import * as pako from 'pako';

@Injectable({
  providedIn: 'root'
})
export class ImageProcessingService {

  constructor() { }

  // Method to compress the base64 image using pako
  compressImage(base64Image: string): Uint8Array {
    // Extract the base64 data part
    const base64Data = base64Image.split(',')[1];
    const binaryString = atob(base64Data);
    const len = binaryString.length;
    const uint8Array = new Uint8Array(len);

    for (let i = 0; i < len; i++) {
      uint8Array[i] = binaryString.charCodeAt(i);
    }

    // Compress the image data using pako
    const compressed = pako.gzip(uint8Array);
    return compressed;
  }

  // Method to decompress and convert back to a base64 image
  decompressImage(compressedData: Uint8Array): string {
    const decompressed = pako.ungzip(compressedData);
    const binaryString = String.fromCharCode.apply(null, Array.from(decompressed));
    const base64Image = btoa(binaryString);

    // Return the base64 image with the appropriate data URI prefix
    return `data:image/png;base64,${base64Image}`;
  }
}
