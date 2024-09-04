import { Injectable } from '@angular/core';
import * as pako from 'pako';

@Injectable({
  providedIn: 'root'
})
export class FileProcessingService {

  constructor() { }

  validateFile(file: File): boolean {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      return false;
    }
    if (file.size > 10 * 1024 * 1024) {
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
          resolve(base64File);
        } else {
          reject('convertFileToBase64- File conversion to base64 failed.');
        }
      };
      reader.onerror = () => {
        reject(reader.error);
      };
      reader.readAsDataURL(file);
    });
  }

  downloadFile(base64File: string, fileName: string) {
    try {
      if (!this.isValidBase64(base64File)) {
        return;
      }
      const commaIndex = base64File.indexOf(',');
      if (commaIndex === -1) {
        return;
      }
      const base64Data = base64File.slice(commaIndex + 1);
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
      link.click();
    } catch (error) {
      throw error;
    }
  }

  compressFile(base64File: string): string {
    try {
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
      const compressedBase64 = btoa(String.fromCharCode(...new Uint8Array(compressedData)));
      return compressedBase64;
    } catch (error) {
      throw error;
    }
  }

  decompressFile(compressedBase64File: string): string {
    try {
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
      const decompressedBase64 = btoa(String.fromCharCode(...new Uint8Array(decompressedUint8Array)));
      return `data:image/png;base64,${decompressedBase64}`;
    } catch (error) {
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
