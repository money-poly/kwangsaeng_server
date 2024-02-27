import { Test, TestingModule } from '@nestjs/testing';
import { StoresService } from '../../src/stores/stores.service';
import { StoresRepository } from 'src/stores/stores.repository';
import { CreateStoreDto } from 'src/stores/dto/create-store.dto';
import { User } from 'src/users/entity/user.entity';
import { Roles } from 'src/users/enum/roles.enum';
import { UserStatus } from 'src/users/enum/user-status.enum';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { mockDynamo, mockEntityManager } from 'test/config/mock-entity-manager';
import { getModelToken } from 'nestjs-dynamoose';
import { CategoriesService } from 'src/categories/categories.service';
import { MenusService } from 'src/menus/menus.service';
import { UsersService } from 'src/users/users.service';
import { TagsService } from 'src/tags/tags.service';
import { UsersRepository } from 'src/users/users.repository';
import { AuthService } from 'src/auth/auth.service';
import { Store } from 'src/stores/entity/store.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { StoreDetail } from 'src/stores/entity/store-detail.entity';
import { StoreApprove } from 'src/stores/entity/store-approve.entity';
import { BusinessDetail } from 'src/stores/entity/business-detail.entity';
import { Category } from 'src/categories/entity/category.entity';
import { Menu } from 'src/menus/entity/menu.entity';
import { MenusRepository } from 'src/menus/menus.repository';
import { MenuView } from 'src/menus/entity/menu-view.entity';
import { TokensRepository } from 'src/auth/auth.repository';
import { Token } from 'src/auth/entity/token.entity';
import { Logger } from '@nestjs/common';
import { mockDataSource } from 'test/config/mock-query-runner';
import { Tag } from 'src/tags/entity/tag.entity';

describe('StoresService', () => {
    let service: StoresService;
    let repository: StoresRepository;
    let categoriesService: CategoriesService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                StoresService,
                StoresRepository,
                { provide: getRepositoryToken(Store), useValue: mockEntityManager },
                { provide: getRepositoryToken(StoreDetail), useValue: mockEntityManager },
                { provide: getRepositoryToken(StoreApprove), useValue: mockEntityManager },
                { provide: getRepositoryToken(BusinessDetail), useValue: mockEntityManager },
                CategoriesService,
                { provide: getRepositoryToken(Category), useValue: mockEntityManager },
                UsersService,
                UsersRepository,
                { provide: getRepositoryToken(User), useValue: mockEntityManager },
                MenusService,
                MenusRepository,
                { provide: getRepositoryToken(Menu), useValue: mockEntityManager },
                { provide: getRepositoryToken(MenuView), useValue: mockEntityManager },
                TokensRepository,
                { provide: getRepositoryToken(Token), useValue: mockEntityManager },
                AuthService,
                JwtService,
                TagsService,
                { provide: getRepositoryToken(Tag), useValue: mockEntityManager },
                { provide: EntityManager, useValue: mockEntityManager },
                Logger,
                { provide: DataSource, useValue: mockDataSource },
                { provide: getModelToken('Store-Menu'), useValue: mockDynamo() },
            ],
        }).compile();

        service = module.get<StoresService>(StoresService);
        repository = module.get<StoresRepository>(StoresRepository);
        categoriesService = module.get<CategoriesService>(CategoriesService);
    });

    it('Store Module 의존성 주입 확인', () => {
        expect(service).toBeDefined();
        expect(repository).toBeDefined();
    });

    describe('가게 추가', () => {
        it('가게 추가 성공', async () => {
            const dto: CreateStoreDto = {
                name: '테스트 가게 이름',
                businessLeaderName: '테스트 가게 리더 이름',
                businessNum: '테스트 가게 사업자 번호',
                categories: [3],
                address: '테스트 가게 주소',
                cookingTime: 10,
                operationTimes: {
                    startedAt: '10:00',
                    endedAt: '23:00',
                },
            };

            const user = new User({
                fId: 'ABCDEFG',
                name: '공진성',
                phone: '010-1234-1234',
                role: Roles.OWNER,
                status: UserStatus.ACTIVATE,
                isAuth: false,
            });

            const result = await service.createStore(user, dto);
            expect(result).toBeUndefined();
        });
    });

    describe('가게 조회', () => {
        it('가게 조회 성공(유저)', async () => {
            const user = new User({
                fId: 'ABCDEFG',
                name: '공진성',
                phone: '010-1234-1234',
                role: Roles.OWNER,
                status: UserStatus.ACTIVATE,
                isAuth: false,
            });
            const store = new Store({ name: '뉴욕바게트', user });
            const lat = 32.62;
            const lon = 127.0583;

            // jest.spyOn(repository, 'findOneStore').mockReturnValue({
            //     {id: 1}
            // });
            const result = await service.findStore(store, { lat, lon });
            console.log(result);
            // expect(result).toBe()
        });
    });
});

// class UserCreateFixture {
//     static create(
//         fId = 'ABCDEFG',
//         name = '공진성',
//         phone = '010-1234-1234',
//         role = Roles.OWNER,
//         status = UserStatus.ACTIVATE,
//         isAuth = true,
//     ): User {
//         return {
//             id: 1,
//             fId,
//             name,
//             phone,
//             role,
//             status,
//             isAuth,
//             store: {},
//             createdDate: new Date(),
//             deletedDate: new Date(),
//             modifiedDate: new Date(),
//         };
//     }
// }
