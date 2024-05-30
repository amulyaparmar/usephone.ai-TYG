const twilio = require('twilio');

export const twilioConfig:any = {
    accountSid: '',
    apiKey: '',
    apiSecret: '',
    twimlAppSid: '',
    callerId: ''
};

const accountSid = '';
const authToken = '';
export const client = twilio(accountSid, authToken);
