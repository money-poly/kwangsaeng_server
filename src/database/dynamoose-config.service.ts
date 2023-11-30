import { DynamooseOptionsFactory, DynamooseModuleOptions } from 'nestjs-dynamoose';

export class DynamooseConfigService implements DynamooseOptionsFactory {
    createDynamooseOptions(): DynamooseModuleOptions {
        return {
            aws: {
                accessKeyId: process.env.DYNAMODB_ACCESS_KEY,
                secretAccessKey: process.env.DYNAMODB_SECRET_KEY,
                region: process.env.DYNAMODB_REGION,
            },
        };
    }
}
