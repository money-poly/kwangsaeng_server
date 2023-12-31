import { ConfigService } from '@nestjs/config';
import { S3Client } from '@aws-sdk/client-s3';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import * as multerS3 from 'multer-s3';
import * as mime from 'mime-types';
import { Request } from 'express';

export const multerS3Config = (configService: ConfigService): MulterOptions => {
    const s3 = new S3Client({
        region: process.env.AWS_RIGION,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY,
            secretAccessKey: process.env.AWS_SECRET_KEY,
        },
    });

    return {
        storage: multerS3({
            s3,
            bucket: process.env.S3_BUCKET_NAME,
            acl: 'public-read',
            contentType: multerS3.AUTO_CONTENT_TYPE,
            key: function (req: Request, file, cb) {
                const pathParam = req.path.split('/');
                console.log(pathParam);
                let savedPath: string = '';
                let dataType: string = '';
                // pathParam[3] -> stores or menus
                // pathParam[4] -> upload
                // pathParam[5] -> :storeId
                switch (pathParam[3]) {
                    case 'stores':
                        savedPath = 'stores' + '/ID: ' + pathParam[5];
                        dataType = 'storeImage';
                        break;
                    case 'menus':
                        savedPath = 'stores' + '/ID: ' + pathParam[5] + '/menus';
                        dataType = 'menuImage';
                        break;
                }
                const currentDate = new Date();
                const formattedDate = currentDate.toISOString().replace(/:/g, '-').slice(0, -5);
                cb(null, `${savedPath}/${dataType} ${formattedDate}.${mime.extension(file.mimetype)}`);
            },
        }),
        limits: {
            fileSize: 1024 * 1024 * 50, // 50 MB
            files: 1,
        },
        fileFilter(req, file, callback) {
            const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/heic', 'image/heif'];

            if (allowedMimeTypes.includes(file.mimetype)) {
                callback(null, true); // 허용
            } else {
                callback(new Error('Invalid file type. Only JPEG, PNG, and GIF images are allowed.'), false); // 거부
            }
        },
    };
};
