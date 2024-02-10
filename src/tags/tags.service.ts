import { Injectable } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from './entity/tag.entity';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { UpdateTagDto } from './dto/update-tag.dto';
import { TagException } from 'src/global/exception/tag-exception';

@Injectable()
export class TagsService {
    constructor(
        @InjectRepository(Tag)
        private readonly tagsRepository: Repository<Tag>,
    ) {}

    async create(dto: CreateTagDto) {
        const newTag = this.tagsRepository.create(dto);

        await this.tagsRepository.save(newTag).catch((err) => {
            if (err.errno == 1062) {
                throw TagException.ALREADY_EXIST_TAG;
            }
        });
    }

    async findOne(options: FindOneOptions<Tag>) {
        return await this.tagsRepository.findOne(options);
    }

    async find(options: FindManyOptions<Tag>) {
        return await this.tagsRepository.find(options);
    }

    async update(id: number, dto: UpdateTagDto) {
        const exist = await this.tagsRepository.exist({
            where: {
                id,
            },
        });

        if (!exist) {
            throw TagException.NOT_FOUND;
        }

        await this.tagsRepository.update(id, {
            ...dto,
        });
    }

    async initTags() {
        const tags: CreateTagDto[] = [
            {
                name: '마감할인',
                description: '마감시간 특별 할인',
                icon: 'alarm',
                content: '마감할인',
                textColor: 'FF6FC36D',
                backgroundColor: 'FFF4F6FA',
            },
            {
                name: '브레이크타임 할인',
                description: '브레이크타임 특별 할인',
                icon: 'alarm',
                content: '브레이크할인',
                textColor: 'FF6FC36D',
                backgroundColor: 'FFF4F6FA',
            },
            {
                name: '오픈할인',
                description: '오픈시간 특별 할인',
                icon: 'sun',
                content: '오픈할인',
                textColor: 'FF2260FF',
                backgroundColor: 'FFF4F6FA',
            },
            {
                name: '서프라이즈백',
                description: '가격대에 맞게 음식들을 랜덤하게 보내주는 랜덤박스',
                icon: 'box',
                content: '서프라이즈백',
                textColor: 'FFEE3C32',
                backgroundColor: 'FFF4F6FA',
            },
        ];

        const isExist = await this.tagsRepository.exist({
            where: {
                name: '마감할인',
            },
        });

        if (!isExist) {
            for (const tag of tags) {
                await this.create(tag);
            }
        }
    }
}
