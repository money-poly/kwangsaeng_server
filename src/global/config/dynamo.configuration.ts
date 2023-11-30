import { registerAs } from '@nestjs/config';

export default registerAs('dynamo', () => ({
    dynamoAccessKey: process.env.DYNAMODB_ACCESS_KEY.toString(),
    dynamoSecretKey: process.env.DYNAMODB_SECRET_KEY.toString(),
    region: process.env.DYNAMODB_REGION.toString(),
}));
