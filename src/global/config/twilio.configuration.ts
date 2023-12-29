import { registerAs } from '@nestjs/config';

export default registerAs('twilio', () => ({
    sid: process.env.TWILIO_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    verifyServiceSid: process.env.TWILIO_VERIFY_SERVICE_SID,
}));
