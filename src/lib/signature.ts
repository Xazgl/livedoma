import { HmacSHA256 } from 'crypto-js'
import Base64 from 'crypto-js/enc-base64';

export function sign(val: string, secret: string): string {
  const hmacDigest = Base64.stringify(HmacSHA256(val, secret)).replace(/\=+$/, '');
  return val + '.' + hmacDigest
};

export function unsign(val: string, secret: string): string | boolean {
  const mac = sign(val, secret); // получаем строку тест.тест2
  const str = mac.split(".")[0]; //получаем  тест
  return val === str? mac  : false;
};

