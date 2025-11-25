// Test script to verify Indori SMS integration
const fetch = require('node-fetch');

async function testSMS() {
  const AUTH_TOKEN = '34394143533130301761645526';
  const SENDER_ID = 'URBSTM';
  const TEMPLATE_ID = '1707176381851496322';
  const phone = '+918140126027';
  const otp = '123456';
  
  const message = `${otp} is your verification code for Urban Steam. Please do not share this code. - ACS Group URBSTM`;
  
  const url = new URL('http://sms.smsindori.com/http-tokenkeyapi.php');
  url.searchParams.append('authentic-key', AUTH_TOKEN);
  url.searchParams.append('senderid', SENDER_ID);
  url.searchParams.append('route', '16');
  url.searchParams.append('number', phone);
  url.searchParams.append('message', message);
  url.searchParams.append('templateid', TEMPLATE_ID);

  console.log('SMS URL:', url.toString());
  
  try {
    const response = await fetch(url.toString());
    const result = await response.text();
    
    console.log('Response Status:', response.status);
    console.log('Response:', result);
  } catch (error) {
    console.error('Error:', error);
  }
}

testSMS();