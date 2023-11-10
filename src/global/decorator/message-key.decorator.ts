import { SetMetadata } from '@nestjs/common';
export const messageKey = 'ResponseMessageKey';
export const ResponseMeta = (message: string) => SetMetadata(messageKey, message);
