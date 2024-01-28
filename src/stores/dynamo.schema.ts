import { Schema } from 'dynamoose';

export const DynamoSchema = new Schema(
    {
        storeName: {
            type: String,
            hashKey: true,
            required: true,
        },
        menuId: {
            type: Number,
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
