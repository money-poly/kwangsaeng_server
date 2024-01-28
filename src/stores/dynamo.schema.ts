import { Schema } from 'dynamoose';

export const DynamoSchema = new Schema(
    {
        menuId: {
            type: Number,
            hashKey: true,

            required: true,
        },
        storeName: {
            type: String,
            rangeKey: true,
            required: true,
        },
        storeId: {
            type: Number,
            required: true,
        },
        menuName: {
            type: String,
        },
        menuPictureUrl: {
            type: String,
        },
        sellingPrice: {
            type: Number,
        },
        discountRate: {
            type: Number,
        },
        viewCount: {
            type: Number,
        },
    },
    {
        timestamps: false, // createdAt, updateAt 컬럼
    },
);
