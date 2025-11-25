export class IndoriSmsService {
  private static readonly BASE_URL = 'http://sms.smsindori.com/http-api.php';
  private static readonly USERNAME = process.env.INDORI_SMS_USERNAME!;
  private static readonly PASSWORD = process.env.INDORI_SMS_PASSWORD!;
  private static readonly SENDER_ID = process.env.INDORI_SMS_SENDER_ID!;
  private static readonly TEMPLATE_ID = process.env.INDORI_SMS_TEMPLATE_ID!;

  static async sendOTP(phone: string, otp: string): Promise<boolean> {
    try {
      // Remove +91 prefix if present, Indori SMS expects just the number
      const cleanPhone = phone.replace('+91', '').replace('+', '');
      const message = `${otp} is your verification code for Urban Steam. Please do not share this code. - ACS Group URBSTM`;
      
      const url = new URL(this.BASE_URL);
      url.searchParams.append('username', this.USERNAME);
      url.searchParams.append('password', this.PASSWORD);
      url.searchParams.append('senderid', this.SENDER_ID);
url.searchParams.append('route', 'TRANSACTIONAL'); // Use exact route name from dashboard
      url.searchParams.append('number', cleanPhone);
      url.searchParams.append('message', message);
      url.searchParams.append('templateid', this.TEMPLATE_ID); // Template is approved!

      console.log('SMS URL:', url.toString());
      
      const response = await fetch(url.toString());
      const result = await response.text();
      
      console.log('Indori SMS Response Status:', response.status);
      console.log('Indori SMS Response:', result);
      
      // Check if response contains success indicators
      const isSuccess = response.ok && !result.toLowerCase().includes('error') && !result.toLowerCase().includes('fail');
      
      return isSuccess;
    } catch (error) {
      console.error('Indori SMS Error:', error);
      return false;
    }
  }
}