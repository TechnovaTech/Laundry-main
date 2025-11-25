export class IndoriSmsService {
  private static readonly BASE_URL = 'http://sms.smsindori.com/http-tokenkeyapi.php';
  private static readonly AUTH_TOKEN = process.env.INDORI_SMS_AUTH_TOKEN!;
  private static readonly SENDER_ID = process.env.INDORI_SMS_SENDER_ID!;
  private static readonly TEMPLATE_ID = process.env.INDORI_SMS_TEMPLATE_ID!;

  static async sendOTP(phone: string, otp: string): Promise<boolean> {
    try {
      const message = `${otp} is your verification code for Urban Steam. Please do not share this code. - ACS Group URBSTM`;
      
      const url = new URL(this.BASE_URL);
      url.searchParams.append('authentic-key', this.AUTH_TOKEN);
      url.searchParams.append('senderid', this.SENDER_ID);
      url.searchParams.append('route', '16');
      url.searchParams.append('number', phone);
      url.searchParams.append('message', message);
      url.searchParams.append('templateid', this.TEMPLATE_ID);

      const response = await fetch(url.toString());
      const result = await response.text();
      
      console.log('Indori SMS Response:', result);
      return response.ok;
    } catch (error) {
      console.error('Indori SMS Error:', error);
      return false;
    }
  }
}