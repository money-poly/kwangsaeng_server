import { registerAs } from '@nestjs/config';

export default registerAs('aligo', () => ({
    apiKey: process.env.ALIGO_API_KEY,
    userId: process.env.ALIGO_USER_ID,
    sender: process.env.ALIGO_SENDER,
}));
