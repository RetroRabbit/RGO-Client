import { Injectable } from '@angular/core';
import * as pako from 'pako';

@Injectable({
  providedIn: 'root'
})
export class FileProcessingService {

  constructor() { }

  validateFile(file: File): boolean {
    console.log('Validating file:', file);
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      console.error('Invalid file type:', file.type);
      return false;
    }
    if (file.size > 10 * 1024 * 1024) {
      console.error('File size exceeds limit:', file.size);
      return false;
    }
    return true;
  }

  convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64File = reader.result as string;
        if (base64File) {
          console.log('convertFileToBase64- Converted file to base64:', base64File);
          resolve(base64File);
        } else {
          reject('convertFileToBase64- File conversion to base64 failed.');
        }
      };
      reader.onerror = () => {
        console.error('Error converting file to base64:', reader.error);
        reject(reader.error);
      };
      reader.readAsDataURL(file);
    });
  }

  downloadFile(base64File: string, fileName: string) {
    try {
      if (!this.isValidBase64(base64File)) {
        console.error('downloadFile- Invalid base64 file data');
        return;
      }
      const commaIndex = base64File.indexOf(',');
      if (commaIndex === -1) {
        console.error('downloadFile- Invalid base64 file data');
        return;
      }
      const base64Data = base64File.slice(commaIndex + 1);
      console.log('downloadFile- Base64 data before decoding:', base64Data);

      const byteString = atob(base64Data);
      const arrayBuffer = new ArrayBuffer(byteString.length);
      const intArray = new Uint8Array(arrayBuffer);

      for (let i = 0; i < byteString.length; i++) {
        intArray[i] = byteString.charCodeAt(i);
      }

      const blob = new Blob([arrayBuffer], { type: 'application/octet-stream' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = fileName;
      console.log('downloadFile- Triggering file download for:', fileName);
      link.click();
    } catch (error) {
      console.error('downloadFile- Error decoding base64 data or triggering download:', error);
    }
  }

  compressFile(base64File: string): string {
    try {
      console.log('compressFile- Base64 data before compression:', base64File);
      if (!this.isValidBase64(base64File)) {
        throw new Error('compressFile- Invalid base64 file data');
      }
      const base64Data = base64File.split(',')[1];
      const byteString = atob(base64Data);
      const uint8Array = new Uint8Array(byteString.length);

      for (let i = 0; i < byteString.length; i++) {
        uint8Array[i] = byteString.charCodeAt(i);
      }

      const compressedData = pako.deflate(uint8Array);
      console.log('compressFile- Compressed data:', compressedData);

      const compressedBase64 = btoa(String.fromCharCode(...new Uint8Array(compressedData)));
      console.log('compressFile- Compressed base64 data:', compressedBase64);
      return compressedBase64;
    } catch (error) {
      console.error('compressFile- Error compressing file:', error);
      throw error;
    }
  }

  decompressFile(compressedBase64File: string): string {
    try {
      console.log('decompressFile- Compressed base64 data before decompression:', compressedBase64File);
      if (!this.isValidBase64(compressedBase64File)) {
        throw new Error('decompressFile- Invalid base64 file data');
      }
      const compressedBase64Data = compressedBase64File.split(',')[1] || compressedBase64File;
      const compressedByteString = atob(compressedBase64Data);
      const compressedUint8Array = new Uint8Array(compressedByteString.length);

      for (let i = 0; i < compressedByteString.length; i++) {
        compressedUint8Array[i] = compressedByteString.charCodeAt(i);
      }

      const decompressedUint8Array = pako.inflate(compressedUint8Array);
      console.log('decompressFile- Decompressed data:', decompressedUint8Array);

      const decompressedBase64 = btoa(String.fromCharCode(...new Uint8Array(decompressedUint8Array)));
      console.log('decompressFile- Decompressed base64 data:', decompressedBase64);
      return `data:image/png;base64,${decompressedBase64}`;
    } catch (error) {
      console.error('decompressFile- Error decompressing file:', error);
      throw error;
    }
  }

  isValidBase64(base64String: string): boolean {
    const base64Regex = /^[a-zA-Z0-9+/=]+$/;
    const base64Data = base64String.split(',')[1] || base64String;
    return base64Regex.test(base64Data);
  }

  findInvalidCharacters(data: string): string[] {
    const invalidChars = [];
    for (let i = 0; i < data.length; i++) {
      if (data.charCodeAt(i) > 127) {
        invalidChars.push(data.charAt(i));
      }
    }
    return invalidChars;
  }
}
