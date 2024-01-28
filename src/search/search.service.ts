import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Keyword } from './entity/keyword.entity';
import { Repository } from 'typeorm';
import { SearchException } from 'src/global/exception/search-exception';
import { SearchReqDto } from './dto/search.request';
import { FindRecommandDto } from './dto/find-recommand.dto';
import { UpdateRecommandDto } from './dto/update-recommand.dto';
import { StoresService } from 'src/stores/stores.service';

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
        const apiUrl = `https://search-kwangsaeng-search-1-tl3a7tujtapaelfewumc2ibhym.ap-northeast-2.cloudsearch.amazonaws.com/2013-01-01/search?q=${keyword}&size=${size}&return=_all_fields`;

        return await axios.get(apiUrl);
    }

    public async checkValidDistance(result, location) {
        const nearStoreIds = await this.storesService.findStoresWithLocation(location);

        return result.data['hits'].hit
            .filter((e) => nearStoreIds.includes(parseInt(e.fields['storeid'], 10)))
            .map((e) => e.fields);
    }

    public async createRecommand(keyword: Keyword) {
        const recommand = this.keywordRepository.create(keyword);
        if (recommand.id < 1) throw SearchException.FAIL_SAVE_RECOMMAND_KEYWORD;
    }

    public async findRecommand(type: string): Promise<FindRecommandDto[]> {
        const result = await this.keywordRepository.findBy({ type });
        // exclude keywordType
        return result.map((e) => new FindRecommandDto(e));
    }

    public async updateRecommand(id: number, keyword: UpdateRecommandDto) {
        const exist = await this.keywordRepository.exist({ where: { id } });
        if (!exist) {
            throw SearchException.RECOMMAND_KEYWORD_NOT_FOUND;
        }
        await this.keywordRepository.update(id, {
            ...keyword,
        });
    }
}
