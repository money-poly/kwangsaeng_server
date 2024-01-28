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
import { UpdateRecommandDto } from './dto/update-recommand.dto';
import { CreateRecommandDto } from './dto/create-recommand.dto';
import { SearchReqDto } from './dto/search.request';
import { SearchResDto } from './dto/search.response';
import { FindRecommandDto } from './dto/find-recommand.dto';
import { FindStoreWithLocationDto } from 'src/stores/dto/find-store-with-location.dto';

@Controller('search')
export class SearchController {
    constructor(private readonly searchService: SearchService) {}

    @Get()
    @UseGuards(AuthGuard)
    @UseInterceptors(ClassSerializerInterceptor)
    async search(@Query() dto: SearchReqDto, location: FindStoreWithLocationDto): Promise<SearchResDto[]> {
        const result = await this.searchService.getFromAWSCloudSearch(dto);
        const filteredResult = await this.searchService.checkValidDistance(result, location);
        // exclude storeId
        const transformedData = filteredResult.map((e) => new SearchResDto(e));
        return transformedData;
    }

    @Post('/recommand')
    @UseGuards(AuthGuard, AdminGuard)
    async createRecommand(@Body() dto: CreateRecommandDto) {
        return await this.searchService.createRecommand(dto.toEntity());
    }

    @Get('/recommand/:type')
    @UseGuards(AuthGuard)
    async findRecommand(@Param('type') type: string): Promise<FindRecommandDto[]> {
        return await this.searchService.findRecommand(type);
    }

    @Put('/recommand/:id')
    @UseGuards(AuthGuard, AdminGuard)
    async updateRecommand(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateRecommandDto) {
        return await this.searchService.updateRecommand(id, dto);
    }
}
