import { Injectable } from '@angular/core';
import * as pako from 'pako';
import { decode } from 'punycode';

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

  // deserializeAndDecompressFile(file: any) {
  //   if (!file || !file.buffer) {
  //     console.error("File or buffer is undefined.");
  //     return;
  //   }
  //   // Rest of your method logic
  //   const decompressedData = pako.ungzip(file); // Gzip decompress
  //   return decompressedData.buffer;
  // }
  
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

  // converting compressed array buffer to base64 string for sending to backend

  arrayBufferToBase64(buffer: ArrayBuffer): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  stringToByteArray(docString: string): Uint8Array {
    const encoder = new TextEncoder();
    const byteArray =  encoder.encode(docString);
    return byteArray;
  }

  byteArrayToString(byteArray: ArrayBuffer): string {
    const decoder = new TextDecoder();
    const newString =  decoder.decode(byteArray)
    return newString;
  }

}
