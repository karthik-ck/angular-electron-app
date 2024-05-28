import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class DecryptionService {
  decrypt(encryptedText: any, secretKey: string): any {
    var encryptedData = encryptedText.data
    if (encryptedData) {
      const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
      const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
      return JSON.parse(decryptedText);
    }
  }
}