import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Version } from './entity/version.entity';
import { Repository } from 'typeorm';
import { CreateVersionDto } from './dto/create-version.dto';
import { FindVersionDto } from './dto/find-version.dto';
import { UpdateVersionDto } from './dto/update-version.dto';
import { MobileOS } from './mobile-os.enum';
import { VersionException } from 'src/global/exception/version-exception';

@Injectable()
export class VersionService {
    constructor(
        @InjectRepository(Version)
        private versionRepository: Repository<Version>,
    ) {}

    async create(dto: CreateVersionDto): Promise<void> {
        const newVersion = this.versionRepository.create({
            platform: dto.platform,
            version: dto.version,
        });

        await this.versionRepository.save(newVersion).catch((error) => {
            if (error.errno == 1062) {
                throw VersionException.ALREADY_EXIST_PLATFORM;
            } else throw error;
        });
    }

    async findVersion(dto: FindVersionDto) {
        return await this.versionRepository.findOne({
            select: {
                version: true,
            },
            where: {
                platform: dto.platform,
            },
        });
    }

    async update(dto: UpdateVersionDto): Promise<void> {
        const entity = await this.findOne(dto.platform);

        entity.version = dto.version;

        await this.versionRepository.save(entity);
    }

    async findOne(platform: MobileOS) {
        return await this.versionRepository.findOne({
            where: {
                platform,
            },
        });
    }
}
