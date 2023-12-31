import { registerAs } from '@nestjs/config';

export default registerAs('dynamo', () => ({
    awsAccessKey: process.env.AWS_ACCESS_KEY.toString(),
    awsSecretKey: process.env.AWS_SECRET_KEY.toString(),
    awsRegion: process.env.AWS_REGION.toString(),
}));
