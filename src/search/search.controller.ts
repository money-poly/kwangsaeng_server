import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Get,
    Param,
    Query,
    ParseIntPipe,
    Post,
    Put,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { SearchService } from './search.service';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { AdminGuard } from 'src/auth/guard/admin.guard';
import { UpdateKeywordDto } from './dto/update-keyword.dto';
import { CreateKeywordDto } from './dto/create-keyword.dto';
import { SearchReqDto } from './dto/search.request';
import { SearchResDto } from './dto/search.response';
import { FindKeywordDto } from './dto/find-keyword.dto';
import { FindStoreWithLocationDto } from 'src/stores/dto/find-store-with-location.dto';

@Controller('search')
export class SearchController {
    constructor(private readonly searchService: SearchService) {}

    @Post()
    @UseGuards(AuthGuard)
    @UseInterceptors(ClassSerializerInterceptor)
    async search(@Query() dto: SearchReqDto, @Body() location: FindStoreWithLocationDto): Promise<SearchResDto[]> {
        const result = await this.searchService.getFromAWSCloudSearch(dto);
        const filteredResult = await this.searchService.checkValidDistance(result, location);
        // exclude storeId
        const transformedData = filteredResult.map((e) => new SearchResDto(e));
        return transformedData;
    }

    @Post('/keyword')
    // @UseGuards(AuthGuard, AdminGuard)
    async createKeyword(@Body() dto: CreateKeywordDto) {
        return await this.searchService.createKeyword(CreateKeywordDto.toEntity(dto));
    }

    @Get('/keyword/:type')
    // @UseGuards(AuthGuard)
    async findKeyword(@Param('type') type: string): Promise<FindKeywordDto[]> {
        return await this.searchService.findKeyword(type);
    }

    @Put('/keyword/:id')
    // @UseGuards(AuthGuard, AdminGuard)
    async updateKeyword(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateKeywordDto) {
        return await this.searchService.updateKeyword(id, dto);
    }
}
