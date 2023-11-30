import { Schema } from 'dynamoose';

export const DynamoSchema = new Schema(
    {
        store_id: {
            type: Number,
            hashKey: true,
            required: true,
        },
        menu_id: {
            type: Number,
            rangeKey: true,
            required: true,
        },
        menu_name: {
            type: String,
        },
        menu_image: {
            type: String,
        },
        menu_saleRate: {
            type: Number,
        },
        menu_price: {
            type: Number,
        },
    },
    {
        timestamps: true, // createdAt, updateAt 컬럼
    },
);
