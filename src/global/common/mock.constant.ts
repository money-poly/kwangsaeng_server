import { MenuStatus } from 'src/menus/enum/menu-status.enum';
import { CreateStoreDto } from 'src/stores/dto/create-store.dto';
import { User } from 'src/users/entity/user.entity';
import { Roles } from 'src/users/enum/roles.enum';

export const mockStores: CreateStoreDto[] = [
    {
        name: '뉴욕바게트',
        businessLeaderName: '유정미',
        address: '서울특별시 노원구 광운로 27-34',
        addressDetail: null,
        businessNum: '323-65-58233',
        categories: [4],
        cookingTime: 15,
        operationTimes: {
            startedAt: '07:00',
            endedAt: '23:30',
        },
        storePictureUrl:
            'https://postfiles.pstatic.net/MjAyNDAxMTdfODgg/MDAxNzA1NDg4ODMwOTM2.ulhbei2-OzPW6HEGZCmIclngdg7jORpPa88C1An-ZhQg.JvntZxAVUv9sA1C9y6ivFW9XU9hZ4zNnKZdHfI6IV_cg.JPEG.sdg612/bakery-1868396_1920.jpg?type=w966',
    },
    {
        name: '순수커피 광운대점',
        businessLeaderName: '강태현',
        address: '서울특별시 노원구 월계로45길 28',
        businessNum: '477-33-08554',
        categories: [4],
        cookingTime: 10,
        operationTimes: {
            startedAt: '08:00',
            endedAt: '22:00',
        },
        storePictureUrl:
            'https://postfiles.pstatic.net/MjAyNDAxMTdfOTEg/MDAxNzA1NDg5MTIzMTk4.rIVGMJaUMdLZiG5sVX7aererfQ0ELN0FXX0mGxdiIz0g.5T_eGVPmZpKWVIlMEwnOuDfXu6y_KcJk_c1T2Ut2Hf4g.JPEG.sdg612/%EC%88%9C%EC%88%98%EC%BB%A4%ED%94%BC.jpg?type=w966',
    },
    {
        name: '사랑컵밥',
        businessLeaderName: '김영숙',
        address: '서울특별시 노원구 석계로 13길 11-6',
        addressDetail: null,
        businessNum: '477-02-55495',
        categories: [3],
        cookingTime: 20,
        operationTimes: {
            startedAt: '10:00',
            endedAt: '20:00',
        },
        storePictureUrl:
            'https://postfiles.pstatic.net/MjAyNDAxMTdfMTMy/MDAxNzA1NDkwMTQ3MzQw.OFrm2P5Oub7k3_k2nWtobchPQtydkDmb-I89dsKbFPQg.en17j7MzGqtoAsQhSdPlHyIDbyUE-QevmuWN3ZPulJMg.JPEG.sdg612/%EB%8F%84%EC%8B%9C%EB%9D%BD.jpg?type=w966',
    },
    {
        name: '광생러드',
        businessLeaderName: '양철환',
        address: '서울특별시 노원구 광운로3길 11',
        addressDetail: null,
        businessNum: '1207-46-99855',
        categories: [7],
        cookingTime: 25,
        operationTimes: {
            startedAt: '09:00',
            endedAt: '21:00',
        },
        storePictureUrl:
            'https://postfiles.pstatic.net/MjAyNDAxMTdfNzQg/MDAxNzA1NDkwMTE3NTA1.VqttzPWj6cibLE6MmLTr8VWsMJk0JfpSH77cBZYcQa4g.VVm9y8aSOc15vP5j1AYPJttyaHSMhZrca5BtmM_996Ig.PNG.sdg612/%EA%B7%B8%EB%A6%BC1.png?type=w966',
    },
    {
        name: '순천식당',
        businessLeaderName: '강복자',
        address: '서울특별시 노원구 광운로2길 47-13',
        businessNum: '882-99-33215',
        categories: [4],
        cookingTime: 15,
        operationTimes: {
            startedAt: '10:00',
            endedAt: '15:00',
        },
        storePictureUrl:
            'https://postfiles.pstatic.net/MjAyNDAxMTdfMTkx/MDAxNzA1NDkwMTUxNTAy.WjehTHPYpMCi_p30KCioG-DCuYXXzxiSY-Z-legvVZUg.8aT0sTQ0iB3O7dTO3i5NNEqLL5-MDD1Eh6cCGQIBFJcg.JPEG.sdg612/%EB%B7%94%ED%8E%98.jpg?type=w966',
    },
];

export const mockOwners: User[] = [
    new User({
        fId: 'IEY494xKjTS7CkxSn9MIIT9LZ0B2',
        name: '유정미',
        role: Roles.OWNER,
        phone: '010-1111-1111',
    }),
    new User({
        fId: 'TZ3zKZC2NXMSb0T0TUujxeZVVRd2',
        name: '강태현',
        role: Roles.OWNER,
        phone: '010-2222-2222',
    }),
    new User({
        fId: 'ipCQpH0aOkNUkLLbjhZlMv4XPwF3',
        name: '김영숙',
        role: Roles.OWNER,
        phone: '010-3333-3333',
    }),
    new User({
        fId: 'Do0OYiAFpBbdETfdOwLM2PBHFD43',
        name: '양철환',
        role: Roles.OWNER,
        phone: '010-4444-4444',
    }),
    new User({
        fId: '9OSbqXCX7Mhq8OZS1r9ctxNKe6y2',
        name: '강복자',
        role: Roles.OWNER,
        phone: '010-5555-5555',
    }),
];

export const mockMenuNames = [
    ['브룩클린 바게트', '갈릭바게트', '소금빵', '쿠앤크쉐이크', '딸기몽땅', '아메리카노', '카페라떼'],
    ['아메리카노', 'The메리카노', '순수라떼', '순수모카', '카모마일', '블랙레몬에이드', '블루레몬에이드'],
    ['사랑컵밥', '베이컨김치컵밥', '베이컨치즈 컵밥', '제육컵밥', '김치제육컵밥', '치킨마요', '참치마요'],
    [
        '연어포케',
        '유자연어샐러드',
        '케이준 치킨샐러드',
        '닭가슴살 샐러드',
        '광광샐럭드',
        '닭가슴살 포케',
        '쉬림프 샐러드',
    ],
    ['잡채', '돼지수육', '김치제육', '나물무침', '순대볶음', '김밥', '알리오올리오'],
];

export const mockDiscountRates = [
    [10, 10, 10, 10, 10, 10, 10],
    [10, 10, 10, 12, 10, 10, 10],
    [10, 10, 10, 10, 10, 10, 20],
    [10, 10, 10, 10, 20, 10, 10],
    [10, 30, 10, 10, 15, 10, 10],
];

export const mockPrices = [
    [8000, 8900, 4000, 4300, 6500, 2000, 3000],
    [1500, 2500, 3400, 4000, 2500, 4000, 4000],
    [4500, 5600, 6100, 6500, 7000, 5200, 4500],
    [13500, 12000, 14000, 13500, 11000, 14000, 12500],
    [4000, 9000, 9000, 4000, 12000, 4000, 8000],
];
export const mockSalePrices = [
    [7200, 8010, 3600, 3870, 5850, 1800, 2700],
    [1350, 2250, 3060, 3520, 2250, 3600, 3600],
    [4050, 5040, 5490, 5850, 6300, 4690, 3600],
    [12150, 10800, 12600, 12150, 8800, 12600, 11250],
    [3600, 6300, 8100, 3600, 10200, 3600, 7200],
];

export const mockMenuDescriptions = [
    [
        '아무것도 첨가되지 않은 뉴욕바게트 플레인 바게트입니다.',
        '뉴욕바게트의 바게트에 신선한 의성마늘소스를 발라 구워낸 마늘빵입니다.',
        '천일염으로 만든 빵',
        '쿠앤크로 만든 밀크쉐이크(우유함유!)',
        '제철 논산딸기로 만드는 딸기파르페 (봄 시즌 한정)',
        '콜롬비아 원두 100% 두툼한 바디감이 느껴지는 커피',
        '진한맛의 카페라떼',
    ],
    [
        '브라질산 원두와 에티오피아 원두를 로스팅해 만든 커피로 만든 아메리카노',
        '1L 대용량 아메리카노',
        '순수커피만의 깊고 달달한 라떼',
        '순수커피만의 특별한 향의 모카라떼',
        '향긋한 차',
        '상큼한 블랙 레몬에이드',
        '상큼한 블루 레몬에이드',
    ],
    [
        '볶음김치, 참치마요, 옥수수콘, 김가루가 들어간 가장 기본적인 컵밥입니다.',
        '볶음김치, 베이컨, 김가루가 들어간 컵밥입니다.',
        '볶음김치, 베이컨, 치즈, 김가루가 들어간 컵밥입니다.',
        '제육볶음과 김가루가 들어간 컵밥입니다. 가장 인기가 많은 컵밥입니다.',
        '제육복음과 볶음김치가 들어간 컵밥입니다.',
        '순살치킨, 계란고명, 특별한 소스와 마요네즈로 비벼먹는 컵밥입니다.',
        '매장에서 직접 만든 참치마요가 들어간 컵밥입니다.',
    ],
    [
        '국내산 현미와 노르웨이산 연어로 만든 연어포케입니다.',
        '상큼 달콤한 유자소스와 같이 먹는 연어샐러드입니다. 연어는 노르웨이산입니다.',
        '매장에서 직접 만든 닭가슴살 치킨에 케이준 소스를 같이 먹는 든든한 한끼식사 케이준 치킨샐러드입니다.',
        '식단하는 사람을 위한 닭가슴살 샐러드. 운동하시는 사장님이 직접 개발한 레시피로 만듭니다.',
        '오로지 광샐러드에서만 만날 수 있는 기본 샐러드',
        '국내산 현미와 삶은 구운 닭가슴살과 같이 먹는 건강식',
        '새우가 들억는 기본 샐러드입니다. 드레싱 변경가능',
    ],
    [
        '당일 아침 조리. 엄마 손맛 잡채',
        '당일 아침 조리. 앞다리살로 만든 돼지수육',
        '당일 아침 조리. 앞다리살로 만들어 김치와 함께 볶은 김치제육',
        '콩나물, 시금치, 고사리 국내산 삼색나물 무침',
        '순대와 야채를 같이 볶은 요리',
        '당일 아침 조리, 직접 싼 김밥',
        '당일 아침 조리 기름 파스타',
    ],
];

export const mockCountryOfOrigins = [
    [
        {
            ingredient: '밀',
            origin: '수입산',
        },
        {
            ingredient: '버터',
            origin: '국내산',
        },
        {
            ingredient: '마늘',
            origin: '국내산(의성)',
        },
        {
            ingredient: '원두',
            origin: '콜롬비아산',
        },
        {
            ingredient: '우유',
            origin: '국내산',
        },
        {
            ingredient: '쿠앤크',
            origin: '수입산',
        },
        {
            ingredient: '딸기',
            origin: '국내산(논산)',
        },
    ],
    [
        {
            ingredient: '원두',
            origin: '브라질산, 콜롬비아산',
        },
        {
            ingredient: '우유',
            origin: '국내산',
        },
        {
            ingredient: '카카오분말',
            origin: '국내산',
        },
        {
            ingredient: '캐모마일',
            origin: '수입산',
        },
        {
            ingredient: '블랙레몬시럽',
            origin: '국내산',
        },
        {
            ingredient: '블루레몬시럽',
            origin: '국내산',
        },
        {
            ingredient: '탄산수',
            origin: '국내산',
        },
    ],
    [
        {
            ingredient: '쌀',
            origin: '국내산',
        },
        {
            ingredient: '김가루',
            origin: '국내산',
        },
        {
            ingredient: '베이컨',
            origin: '수입산',
        },
        {
            ingredient: '김치',
            origin: '수입산',
        },
        {
            ingredient: '닭고기',
            origin: '국내산',
        },
        {
            ingredient: '덮밥소스',
            origin: '국내산',
        },
        {
            ingredient: '마요네즈',
            origin: '국내산',
        },
    ],
    [
        {
            ingredient: '현미',
            origin: '국내산',
        },
        {
            ingredient: '닭가슴살',
            origin: '브라질산',
        },
        {
            ingredient: '연어',
            origin: '노르웨이산',
        },
        {
            ingredient: '양상추',
            origin: '국내산',
        },
        {
            ingredient: '적상추',
            origin: '국내산',
        },
        {
            ingredient: '적양파',
            origin: '국내산',
        },
        {
            ingredient: '병아리콩',
            origin: '수입산',
        },
        {
            ingredient: '샐러드 드레싱',
            origin: '국내산',
        },
        {
            ingredient: '마요네즈',
            origin: '국내산',
        },
        {
            ingredient: '유자드레싱',
            origin: '국내산',
        },
        {
            ingredient: '아보카도',
            origin: '수입산',
        },
    ],
    [
        {
            ingredient: '당면',
            origin: '국내산',
        },
        {
            ingredient: '당근',
            origin: '국내산',
        },
        {
            ingredient: '양파',
            origin: '국내산',
        },
        {
            ingredient: '돼지고기',
            origin: '수입산',
        },
        {
            ingredient: '김치',
            origin: '국내산',
        },
        {
            ingredient: '순대',
            origin: '국내산',
        },
        {
            ingredient: '나물',
            origin: '국내산',
        },
        {
            ingredient: '김',
            origin: '국내산',
        },
        {
            ingredient: '단무지',
            origin: '국내산',
        },
    ],
];

export const mockMenuStatus = [
    [
        MenuStatus.SALE,
        MenuStatus.SALE,
        MenuStatus.SOLDOUT,
        MenuStatus.SALE,
        MenuStatus.SALE,
        MenuStatus.SALE,
        MenuStatus.SALE,
    ],
    [
        MenuStatus.SALE,
        MenuStatus.SALE,
        MenuStatus.SALE,
        MenuStatus.SALE,
        MenuStatus.SALE,
        MenuStatus.SOLDOUT,
        MenuStatus.SALE,
    ],
    [
        MenuStatus.SALE,
        MenuStatus.SALE,
        MenuStatus.SALE,
        MenuStatus.SALE,
        MenuStatus.SALE,
        MenuStatus.SALE,
        MenuStatus.SALE,
    ],
    [
        MenuStatus.SALE,
        MenuStatus.SALE,
        MenuStatus.SALE,
        MenuStatus.SALE,
        MenuStatus.SALE,
        MenuStatus.SALE,
        MenuStatus.SOLDOUT,
    ],
    [
        MenuStatus.SALE,
        MenuStatus.SALE,
        MenuStatus.SALE,
        MenuStatus.SALE,
        MenuStatus.SOLDOUT,
        MenuStatus.SOLDOUT,
        MenuStatus.SALE,
    ],
];

export const mockMenuPictureUrl = [
    [
        'https://postfiles.pstatic.net/MjAyNDAxMTdfNjkg/MDAxNzA1NDkzMTE3MDIy.q6XWbuUwDqF3rxRra8JTB5P7IQWIgDMEip205Cvoaisg.fEtajTA131kZG5jCM5dCIJZ5amEGdoOWMgCWI9sqA-Yg.JPEG.sdg612/%ED%94%8C%EB%A0%88%EC%9D%B8%EB%B0%94%EA%B2%8C%ED%8A%B8.jpg?type=w966',
        'https://postfiles.pstatic.net/MjAyNDAxMTdfNzIg/MDAxNzA1NDkzMTI4Nzk0.JzqJ9kp3wVPGNV9CZEYNrB20DUByM0zN9PNWLRQSRz8g.uxR6945JJgGRIoWUfeoEMA8mhKlNgP16Meb7SAfkEekg.JPEG.sdg612/%EB%A7%88%EB%8A%98%EB%B9%B5.jpg?type=w966',
        'https://postfiles.pstatic.net/MjAyNDAxMTdfMjI5/MDAxNzA1NDkzMTI1NTEz.ndrN1o8TpmQOJGhGslFqsvgGX4RQk1Vl7hZVQ9S6ZLog.wum1x8wvotWkfyMo5Diwqz-nK6hDZLjW1797nxju3i0g.JPEG.sdg612/%EC%86%8C%EA%B8%88%EB%B9%B5.jpg?type=w966',
        'https://postfiles.pstatic.net/MjAyNDAxMTdfNzAg/MDAxNzA1NDkzMTEyNTQ1.k-5Kw-QtBYC9eJ0AFuABrYG6c_-_rQnz_jLfmfXeIDIg.uIuVirg9W-IVxUGb9av0cfH8uafq0et5aEJDlBSzLqsg.JPEG.sdg612/%EC%BF%A0%EC%95%A4%ED%81%AC%EC%89%90%EC%9D%B4%ED%81%AC.jpg?type=w966',
        'https://postfiles.pstatic.net/MjAyNDAxMTdfMTgg/MDAxNzA1NDkzMTE3Mjkw.UgKzj57u-o3KwPPmwU2oEo0tg2rjaZaZUSLXvlulm64g.RGbr5vs2-X05ZQze4sNU2eX_Z2TSKmZ4lzlZwTnqt-kg.JPEG.sdg612/%EB%94%B8%EA%B8%B0%EB%AA%BD%EB%95%85.jpg?type=w966',
        'https://postfiles.pstatic.net/MjAyNDAxMTdfMTg4/MDAxNzA1NDkzMTE4MTI2.VE2yhhmBIkfVN-yq4zY1tJ9p-QsKOUYkPxVQ0tIUFMAg.lOdqimixl4sfhsfUSgNuwRIo4bUyg6TbKZO_14w6q3sg.JPEG.sdg612/1L%EC%95%84%EB%A9%94%EB%A6%AC%EC%B9%B4%EB%85%B8.jpg?type=w966',
        'https://postfiles.pstatic.net/MjAyNDAxMTdfNzgg/MDAxNzA1NDkzMTIwMTIz.l9kVQxhXQeOu8i7isaxt9jKsu6lhAJlZ1FiMENUOrLMg._Ihbg9-Mqo5qhVGBiUUfyWFu9luQWJkZNymWHC8KOKYg.JPEG.sdg612/%EC%B9%B4%ED%8E%98%EB%9D%BC%EB%96%BC.jpg?type=w966',
    ],
    [
        'https://postfiles.pstatic.net/MjAyNDAxMTdfMjE3/MDAxNzA1NDkzMTI1NjU0.tWFVIRAcfDlTXX1_hY9Dqvk-B93imSRXbncn2a2mFf4g.G3fp0xt0UHLKM3F3K27knNoGF864I5q72heiz5yyLdsg.JPEG.sdg612/%EC%95%84%EB%A9%94%EB%A6%AC%EC%B9%B4%EB%85%B8_tnstn.jpg?type=w966',
        'https://postfiles.pstatic.net/MjAyNDAxMTdfMjkz/MDAxNzA1NDkzMTI0NTEx.f_WY7TgnyVwYD9-KuKWtpr6hsv4Mo9I4wK_ygheO-WEg.HaLZNYpLT8AfNQZkRMksfxvRNbCi4ScI6EI20bTcKU0g.JPEG.sdg612/%EC%95%84%EB%A9%94%EB%A6%AC%EC%B9%B4%EB%85%B8.jpg?type=w966',
        'https://postfiles.pstatic.net/MjAyNDAxMTdfNyAg/MDAxNzA1NDkzMTI1Njg2.hh9xLdSwMuWITiVhRqco1Mh6fYqAWBI47VjIuAgNN5og.91inOFwgXZKs0OcKwOL0AiGLPtJh8YUsg2tZDBaCJqMg.JPEG.sdg612/%EC%88%9C%EC%88%98%EB%9D%BC%EB%96%BC.jpg?type=w966',
        'https://postfiles.pstatic.net/MjAyNDAxMjRfMTkx/MDAxNzA2MDk1MzAxNzA0.xqkcn0-nWsMGkrj0nBaLJFCdW-on7MMwrWlm1H1GUBIg.DIt0QJeMA7OWoCOLUWyHbQPb427jwBzEO7NVa46RQr0g.JPEG.sdg612/cafe-mocha-1063007_1920.jpg?type=w966',
        'https://postfiles.pstatic.net/MjAyNDAxMTdfMTU1/MDAxNzA1NDkzMTIxODM0.fgdc15wE5_cUzetZte8DjyZxaPMRiNlzejMLlZ_HH5kg.Maw21VZT9wS4w6_PbAYERjm3toYtFOhb_4lUSd8yWQEg.JPEG.sdg612/%EC%B9%B4%EB%AA%A8%EB%A7%88%EC%9D%BC.jpg?type=w966',
        'https://postfiles.pstatic.net/MjAyNDAxMTdfMTY5/MDAxNzA1NDkzMTI2NDk5.4aI0NWw-NGJGS1JL6xe8oBzImj5WUwssu2iYTNDjDi4g.hqNNHIuhziRzd8hrRvN1PPzk5XEztg-aqBwAYb9ixqcg.JPEG.sdg612/%EB%B8%94%EB%A3%A8%EB%A0%88%EB%AA%AC.jpg?type=w966',
        'https://postfiles.pstatic.net/MjAyNDAxMTdfMTY5/MDAxNzA1NDkzMTI2NDk5.4aI0NWw-NGJGS1JL6xe8oBzImj5WUwssu2iYTNDjDi4g.hqNNHIuhziRzd8hrRvN1PPzk5XEztg-aqBwAYb9ixqcg.JPEG.sdg612/%EB%B8%94%EB%A3%A8%EB%A0%88%EB%AA%AC.jpg?type=w966',
    ],
    [
        'https://postfiles.pstatic.net/MjAyNDAxMTdfMjQw/MDAxNzA1NDkzMTEyNTAy.4Ue8xenVyZF_eZ5d_uGfQ-RpVoNhoqvJh3Oq2boilkgg.Yhw0DFAYm0j4ZHgMMIJaED1k8rMhsqKM9tVKMCZEgvAg.JPEG.sdg612/food-503740_1920.jpg?type=w966',
        'https://postfiles.pstatic.net/MjAyNDAxMjJfMjcz/MDAxNzA1OTE5NDg2NjI3.DEnWmyu3LLbUiUcK1c5MX2s_9bfZ1nLAGkglb-vJt4Ag.gtPhLOIbwCo3NlSXW3kT3c9NZoh_gwxvIUsqZNh3UAYg.JPEG.sdg612/bacon-1341868_1920.jpg?type=w966',
        'https://postfiles.pstatic.net/MjAyNDAxMjJfMjcz/MDAxNzA1OTE5NDg2NjI3.DEnWmyu3LLbUiUcK1c5MX2s_9bfZ1nLAGkglb-vJt4Ag.gtPhLOIbwCo3NlSXW3kT3c9NZoh_gwxvIUsqZNh3UAYg.JPEG.sdg612/bacon-1341868_1920.jpg?type=w966',
        'https://postfiles.pstatic.net/MjAyNDAxMjJfNzYg/MDAxNzA1OTE5NDg1MjU3.8uOoPrwHfoq2vV_nH7q9aP6uavZ1dhomUHXSvdkFzSYg.8q72T64dRTwiGnBjySBY_K-asG3deMo7nD19hrj2EjQg.JPEG.sdg612/korean-lunch-box-1509130_1920.jpg?type=w966',
        'https://postfiles.pstatic.net/MjAyNDAxMjJfNzYg/MDAxNzA1OTE5NDg1MjU3.8uOoPrwHfoq2vV_nH7q9aP6uavZ1dhomUHXSvdkFzSYg.8q72T64dRTwiGnBjySBY_K-asG3deMo7nD19hrj2EjQg.JPEG.sdg612/korean-lunch-box-1509130_1920.jpg?type=w966',
        'https://postfiles.pstatic.net/MjAyNDAxMjJfOTcg/MDAxNzA1OTE5NDk4NzE5.d95hbR9yBjPD5rxXZz4B_snmwuRhD6JrkH-pdhJIsJ4g.ZVJK8HMH52Jv_Ao4BiLKjSF_u7cXlF9uDO6D8L_HDswg.JPEG.sdg612/japanese-6041694_1920.jpg?type=w966',
        'https://postfiles.pstatic.net/MjAyNDAxMjJfOTcg/MDAxNzA1OTE5NDk4NzE5.d95hbR9yBjPD5rxXZz4B_snmwuRhD6JrkH-pdhJIsJ4g.ZVJK8HMH52Jv_Ao4BiLKjSF_u7cXlF9uDO6D8L_HDswg.JPEG.sdg612/japanese-6041694_1920.jpg?type=w966',
    ],
    [
        'https://postfiles.pstatic.net/MjAyNDAxMTdfMTUw/MDAxNzA1NDkzMTIyMTM5.w6GPaNUjJsNMELh21HevscBx8Zu4hIaHNzUaDRNFd1Mg.ufq3eGeJMGNLKRKFd6WhddyWzsg0fJRyXBGDb1CrE3Mg.JPEG.sdg612/%EC%97%B0%EC%96%B4%ED%8F%AC%EC%BC%80.jpg?type=w966',
        'https://postfiles.pstatic.net/MjAyNDAxMTdfNzMg/MDAxNzA1NDkzMTIzMDMz.ytxWEdVMEAMaQXpv__kbaytXA_yORdwsv6BMSYLdqSMg.uKEjIgFRmqS4MmtMkONZ_-EPVZi5RmLq-ABORBkE1dkg.JPEG.sdg612/%EC%97%B0%EB%9F%AC%EC%83%90%EB%9F%AC%EB%93%9C.jpg?type=w966',
        'https://postfiles.pstatic.net/MjAyNDAxMTdfMjQy/MDAxNzA1NDkzMTEzNjg4.YHQ2Ye-dq7WLd-ZzRJfwJWe5tK7SCB4quIKb7IVhHEkg.2mdLtF2mt_p75VC5tYWCgnNu_t4zXo0ViOUHzdcfScYg.JPEG.sdg612/bento-4466402_1920.jpg?type=w966',
        'https://postfiles.pstatic.net/MjAyNDAxMjJfMjcg/MDAxNzA1OTE5NTAwMjQw.WaUhoZiGhTFCbHssxviSNjxLu71PJhs_qocn54z5CUcg.cvQm5-1KqyqUj-xlDoupUAWT5j7LvcJiOqxZFGuLJncg.JPEG.sdg612/salmon-518032_1920.jpg?type=w966',
        'https://postfiles.pstatic.net/MjAyNDAxMjRfNyAg/MDAxNzA2MDk1MjQ1NjU1.dLRXnh3oZDQi0PJ7ti69VinfqJGMfKRuKPJzv_QPb78g.pYzfSgD8ok2_WA1kwuWVaylE-XBkeKa9Qt3Gkk2CIPQg.JPEG.sdg612/salad-374173_1920.jpg?type=w966',
        'https://postfiles.pstatic.net/MjAyNDAxMjJfMjcg/MDAxNzA1OTE5NTAwMjQw.WaUhoZiGhTFCbHssxviSNjxLu71PJhs_qocn54z5CUcg.cvQm5-1KqyqUj-xlDoupUAWT5j7LvcJiOqxZFGuLJncg.JPEG.sdg612/salmon-518032_1920.jpg?type=w966',
        'https://postfiles.pstatic.net/MjAyNDAxMjJfMTIx/MDAxNzA1OTE5NDk4NjQ0.IplQFt_WHCc5yJeUDFyNqxcGe1h3v1TYbwy7VS_R0mMg.BpbHr-0ZsqoEqQtPp_1ekv_l-LnvJttsfx4xJWHhpQEg.JPEG.sdg612/prawn-1239427_1920.jpg?type=w966',
    ],
    [
        'https://postfiles.pstatic.net/MjAyNDAxMjJfMTAx/MDAxNzA1OTE5NDg2MzU5.hHVj72vFIR7kKa1OHbb1hpJUgNze4GZPSbyvW6SVlFEg.L6FCqbVD6K4L-7-PLbqTnZEK1tEfP682PtYvQpLKz90g.JPEG.sdg612/chop-suey-5666461_1920.jpg?type=w966',
        'https://postfiles.pstatic.net/MjAyNDAxMjRfMjQg/MDAxNzA2MDk1MjUzNTkz.ORT-j2JBZI5b8n5BAzD2xpX0btmiZol_k_dYRlySoCIg.xy7VbZon6Kxt5td-6lf-69WweGTTf4W2VbrqSsmmfo8g.JPEG.sdg612/pork-1098553_1920.jpg?type=w966',
        'https://postfiles.pstatic.net/MjAyNDAxMjJfMTA5/MDAxNzA1OTE5NTA2NTgw.5g0ty9T5XUZXcaYXhf0AZrDossg1BRrs_KS5W8puJsgg.kzW6zcO8rKGrsv7z7KEI_hGlOyoDywdmwJaIQgeUE8cg.JPEG.sdg612/squid-stir-fry-3866068_1920.jpg?type=w966',
        'https://postfiles.pstatic.net/MjAyNDAxMjJfODEg/MDAxNzA1OTE5NDg2MjEw.-u0krcnvzVZLaTk-cfxC1b44P3nYXoNvj-nNqqDuPeog.SJUKmY_5YXDyFGduWV8AuTITc8urMXeDoFyNLvW1N0Eg.JPEG.sdg612/herbs-749360_1920.jpg?type=w966',
        'https://postfiles.pstatic.net/MjAyNDAxMjJfMjgg/MDAxNzA1OTE5NDk4ODMz.Dh6QSoYz_py6tRmO4jaNnzkdJJdANgMmRx7P5_KAHzsg.Nt853gVNRn00A29zOU_ptSpbVeXMQBTW3TR9Xjfd1XMg.JPEG.sdg612/sundae-1226570_1920.jpg?type=w966',
        'https://postfiles.pstatic.net/MjAyNDAxMjJfODgg/MDAxNzA1OTE5NDkwODA5.9z1tltgC8BzN_cLVi-AdFTnrCAmg5DrHyp8qTET37Gog.Hb9B7P9edrIViZVlzHaqhlAoAmYfZdPRr0uXgsNWncsg.JPEG.sdg612/kimbab-803637_1920.jpg?type=w966',
        'https://postfiles.pstatic.net/MjAyNDAxMjJfMTAw/MDAxNzA1OTE5NTA2MjQx.x0PE2NyRwZoYnY0N83BiGkji7eA0tWuBS5Gi2zjaaewg.8pOEr40pox5KYuWkOV6zw2tpNV0RvAieKBfx8TuERNQg.JPEG.sdg612/spaghetti-781795_1920.jpg?type=w966',
    ],
];
