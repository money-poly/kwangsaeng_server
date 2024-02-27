import { Model } from 'nestjs-dynamoose';
import { DynamoKey, DynamoSchema } from 'src/stores/interfaces/store-menu-dynamo.interface';

export const mockEntityManager = {
    exist: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    findOneBy: jest.fn(),

    createQueryBuilder: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    innerJoinAndSelect: jest.fn().mockReturnThis(),
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockResolvedValue([]), // 예시: 빈 배열 반환
    // 다른 필요한 메서드를 추가할 수 있습니다.
};

export const mockDynamo = () =>
    ({
        create: jest.fn().mockReturnThis(),
        get: jest.fn().mockReturnThis(),
        update: jest.fn().mockReturnThis(),
        delete: jest.fn().mockReturnThis(),
    }) as unknown as Model<DynamoSchema, DynamoKey>;
