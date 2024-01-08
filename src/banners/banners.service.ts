import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Banner } from './entity/banner.entity';
import { EntityManager, Repository } from 'typeorm';
import { CreateBannerDto } from './dto/create-banner.dto';
import { BannerException } from 'src/global/exception/banners-exception';
import { S3Exception } from 'src/global/exception/s3-exception';
import { CategoriesException } from 'src/global/exception/categories-exception';
import { CreateBannerInterface } from './interface/create-banner.interface';

@Injectable()
export class BannersService {
    constructor(
        @InjectRepository(Banner) private bannerRepository: Repository<Banner>,
        private readonly entityManager: EntityManager,
    ) {}

    async create(dto: CreateBannerInterface, file: Express.MulterS3.File) {
        if (!file.location) {
            throw S3Exception.URL_NOT_FOUND;
        }

        const refinedIsVisible = Boolean(Number(dto.isVisible));
        let order = null;
        if (refinedIsVisible) {
            const maxOrder = await this.entityManager
                .createQueryBuilder(Banner, 'b')
                .select('b.orders AS orders')
                .orderBy('orders', 'DESC')
                .limit(1)
                .getRawOne();
            maxOrder ? (order = Number(maxOrder.orders) + 1) : (order = 1);
        }

        const newBanner = this.bannerRepository.create({
            ...dto,
            isVisible: refinedIsVisible,
            url: file.location,
            orders: order,
        });

        await this.bannerRepository.save(newBanner).catch((error) => {
            if (error.errno == 1062) {
                throw BannerException.ALREADY_EXIST_BANNER;
            } else throw error;
        });
    }

    async findAll() {
        const urlList = await this.entityManager
            .createQueryBuilder(Banner, 'b')
            .select('b.url AS url')
            .where('is_visible = :isVisible', { isVisible: 1 })
            .orderBy('orders', 'ASC')
            .getRawMany();
        return urlList.map((data) => data.url);
    }
}
