import * as Joi from 'joi';

export const validationSchema = Joi.object({
    // SERVER
    SERVER_PORT: Joi.number().required(),

    // DATABASE
    DATABASE_TYPE: Joi.string().required(),
    DATABASE_HOST: Joi.string().required(),
    DATABASE_PORT: Joi.number().required(),
    DATABASE_USERNAME: Joi.string().required(),
    DATABASE_PASSWORD: Joi.string().required(),
    DATABASE_NAME: Joi.string().required(),
    DATABASE_SYNC: Joi.boolean().required().default(false),

    DYNAMODB_ACCESS_KEY: Joi.string().required(),
    DYNAMODB_SECRET_KEY: Joi.string().required(),
    DYNAMODB_REGION: Joi.string().required(),

    // JWT
    JWT_ACCESS_SECRET: Joi.string().required(),
    JWT_ACCESS_EXPIRES: Joi.string().required(),
    JWT_REFRESH_SECRET: Joi.string().required(),
    JWT_REFRESH_EXPIRES: Joi.string().required(),
});
