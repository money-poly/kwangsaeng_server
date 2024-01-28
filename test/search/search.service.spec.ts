import { Test, TestingModule } from '@nestjs/testing';
import axios from 'axios';
// import { SearchService } from '../../src/search/search.service';
import { SearchResDto } from 'src/search/dto/search.response';

describe('SearchService', () => {
    // let service: SearchService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            // providers: [SearchService],
        }).compile();

        // service = module.get<SearchService>(SearchService);
    });

    // it('should be defined', () => {
    //     expect(service).toBeDefined();
    // });

    it('기본 axios 테스트', async () => {
        const keyword = '오렌지';
        const dataSize = 5;
        const apiUrl = `https://search-kwangsaeng-search-1-tl3a7tujtapaelfewumc2ibhym.ap-northeast-2.cloudsearch.amazonaws.com/2013-01-01/search?q=${keyword}&size=${dataSize}&return=_all_fields`;

        const result = await axios.get(apiUrl);
        const menuIds = [9, 12];

        const input = result.data['hits'].hit
            .filter((e) => menuIds.includes(parseInt(e.fields['menuid'], 10)))
            .map((e) => e.fields);

        const transformedData = input.map((item) => new SearchResDto(item));
        console.log(transformedData);

        expect(result.data['hits'].hit[0].fields['menupictureurl']).toBe(
            'https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMDA3MzFfMjMz%2FMDAxNTk2MTI0NDc0OTk0.p_agmR0Ck1xuc1pPXvigSHLbVoAsbDQv6Ns81x9QCCYg.xSQVOBEtv7W9ekGiAZcryCoDaxodoTT3zT4lqWv0yfQg.JPEG.5rangdesign%2FDSCF5788.JPG&type=sc960_832',
        );
        expect(result.data['hits'].hit[0].fields['menuname']).toBe('오렌지 치킨 샐러드12');
        expect(result.data['hits'].hit[0].fields['sellingprice']).toBe('9900');
        expect(result.data['hits'].hit[0].fields['menuid']).toBe('9');
        expect(result.data['hits'].hit[0].fields['storename']).toBe('고씨네');
        expect(result.data['hits'].hit[0].fields['viewcount']).toBe('0');
        expect(result.data['hits'].hit[0].fields['discountrate']).toBe('50');
    });
});
