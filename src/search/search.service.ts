import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Keyword } from './entity/keyword.entity';
import { Repository } from 'typeorm';
import { SearchException } from 'src/global/exception/search-exception';
import { SearchReqDto } from './dto/search.request';
import { FindKeywordDto } from './dto/find-keyword.dto';
import { UpdateKeywordDto } from './dto/update-keyword.dto';
import { StoresService } from 'src/stores/stores.service';
import { FindStoreWithLocationDto } from 'src/stores/dto/find-store-with-location.dto';

@Injectable()
export class SearchService {
    constructor(
        @InjectRepository(Keyword)
        private readonly keywordRepository: Repository<Keyword>,
        private readonly storesService: StoresService,
    ) {}

    public async getFromAWSCloudSearch(dto: SearchReqDto) {
        const keyword = dto.q;
        const size = dto.size;
        const apiUrl = `https://search-kwangsaeng-nindstrzi24sxleaflpbbq7wtu.ap-northeast-2.cloudsearch.amazonaws.com/2013-01-01/search?q=${keyword}&size=${size}&return=_all_fields`;

        return await axios.get(apiUrl);
    }

    public async checkValidDistance(result, location: FindStoreWithLocationDto) {
        const nearStoreIds = (await this.storesService.findStoresWithLocation(location)).map((e) => e.id);
        return result.data['hits'].hit
            .filter((e) => nearStoreIds.includes(parseInt(e.fields['storeid'], 10)))
            .map((e) => e.fields);
    }

    public async createKeyword(keyword: Keyword) {
        if (keyword === undefined) throw SearchException.UNDEFINED_TO_KEYWORD;
        return await this.keywordRepository.save(keyword);
    }

    public async findKeyword(type: string): Promise<FindKeywordDto[]> {
        const result = await this.keywordRepository.findBy({ type });
        // exclude keywordType
        return result.map((e) => new FindKeywordDto(e));
    }

    public async updateKeyword(id: number, keyword: UpdateKeywordDto) {
        const exist = await this.keywordRepository.exist({ where: { id } });
        if (!exist) {
            throw SearchException.RECOMMAND_KEYWORD_NOT_FOUND;
        }
        await this.keywordRepository.update(id, {
            ...keyword,
        });
    }
}
