import * as CryptoJS from 'crypto-js'

// let CryptoJS = require("crypto-js");

export class AESUtil {

  // _keySize: any;
  // _ivSize: any;
  // _iterationCount: any;

  constructor() {
    this._keySize = 256;
    this._ivSize = 128;
    this._iterationCount = 1989;
  }

  get keySize() {
    return this._keySize;
  }

  set keySize(value) {
    this._keySize = value;
  }

  get iterationCount() {
    return this._iterationCount;
  }

  set iterationCount(value) {
    this._iterationCount = value;
  }

  generateKey(salt, passPhrase) {
    return CryptoJS.PBKDF2(passPhrase, CryptoJS.enc.Hex.parse(salt), {
      keySize: this.keySize / 32,
      iterations: this._iterationCount
    })
  }

  // encryptWithIvSalt(salt, iv, passPhrase, plainText) {
  //   let key = this.generateKey(salt, passPhrase);
  //   let encrypted = CryptoJS.AES.encrypt(plainText, key, {
  //     iv: CryptoJS.enc.Hex.parse(iv)
  //   });
  //   let result = encrypted.ciphertext.toString(CryptoJS.enc.Base64);
  //   let iteration = 0;
  //   while (result.includes('/') || result.includes(' ') || result.includes('+')){
  //     key = this.generateKey(salt, passPhrase);
  //     encrypted = CryptoJS.AES.encrypt(plainText, key, {
  //       iv: CryptoJS.enc.Hex.parse(iv)
  //     });
  //     result = encrypted.ciphertext.toString(CryptoJS.enc.Base64);
  //     iteration++;
  //     if (iteration >= 2){
  //       break;
  //     }
  //   }
  //   return result;
  // }

  encryptWithIvSalt(salt, iv, passPhrase, plainText) {
    let key = this.generateKey(salt, passPhrase);
    let encrypted = CryptoJS.AES.encrypt(plainText, key, {
      iv: CryptoJS.enc.Hex.parse(iv)
    });
    let base64Url = CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
    // console.log('cryptée',base64Url)
    return base64Url;
  }


  decryptWithIvSalt(salt, iv, passPhrase, cipherText) {
    let key = this.generateKey(salt, passPhrase);
    let cipherParams = CryptoJS.lib.CipherParams.create({
      ciphertext: CryptoJS.enc.Base64.parse(cipherText)
    });
    let decrypted = CryptoJS.AES.decrypt(cipherParams, key, {
      iv: CryptoJS.enc.Hex.parse(iv)
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
  }

  encrypt(passPhrase, plainText) {
    let iv = CryptoJS.lib.WordArray.random(this._ivSize / 8).toString(CryptoJS.enc.Hex);
    let salt = CryptoJS.lib.WordArray.random(this.keySize / 8).toString(CryptoJS.enc.Hex);
    let ciphertext = this.encryptWithIvSalt(salt, iv, passPhrase, plainText);
    return salt + iv + ciphertext;
  }

  decrypt(passPhrase, cipherText) {
    let ivLength = this._ivSize / 4;
    let saltLength = this.keySize / 4;
    let salt = cipherText.substr(0, saltLength);
    let iv = cipherText.substr(saltLength, ivLength);
    let encrypted = cipherText.substring(ivLength + saltLength);
    return this.decryptWithIvSalt(salt, iv, passPhrase, encrypted);
  }
}

export const aesUtil = new AESUtil();
export const key = "0e7cef307ba3195eef26fe5c1c9497f5";
