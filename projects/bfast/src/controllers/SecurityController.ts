import {AES, enc} from 'crypto-js';


export class SecurityController {
  constructor(private readonly secret: string) {
  }

  async encrypt(data: { [key: string]: any }): Promise<string> {
    if (!data) {
      return data;
    }
    return AES.encrypt(JSON.stringify(data), this.secret).toString();
  }

  async decrypt(data: string): Promise<{ [key: string]: any } | null> {
    if (!data) {
      return null;
    }
    const bytes = AES.decrypt(data, this.secret);
    return JSON.parse(bytes.toString(enc.Utf8));
  }
}
