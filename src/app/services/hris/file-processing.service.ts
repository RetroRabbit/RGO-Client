import { Injectable } from '@angular/core';
import * as pako from 'pako';

@Injectable({
  providedIn: 'root'
})
export class FileProcessingService {

  constructor() { }

  // Compress and serialize the file using pako (Gzip)
  compressAndSerializeFile(arrayBuffer: ArrayBuffer): Uint8Array {
    const uint8Array = new Uint8Array(arrayBuffer);
    const compressedData = pako.gzip(uint8Array); // Gzip compress
    return compressedData;
  }
  
  // Decompress and deserialize the data back to an ArrayBuffer
  deserializeAndDecompressFile(compressedData: Uint8Array): ArrayBuffer {
    const decompressedData = pako.ungzip(compressedData); // Gzip decompress
    return decompressedData.buffer;
  }
  
  // Convert a File object to ArrayBuffer (synchronously using FileReader)
  fileToArrayBuffer(file: File, callback: (arrayBuffer: ArrayBuffer) => void): void {
    const reader = new FileReader();
    reader.onloadend = () => {
      const arrayBuffer = reader.result as ArrayBuffer;
      callback(arrayBuffer);
    };
    reader.readAsArrayBuffer(file); // Reading file as ArrayBuffer
  }
  
  // Convert an ArrayBuffer back to a Blob and trigger the download
  downloadArrayBufferAsFile(arrayBuffer: ArrayBuffer, fileName: string, fileType: string): void {
    const blob = new Blob([arrayBuffer], { type: fileType });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
  }
}
