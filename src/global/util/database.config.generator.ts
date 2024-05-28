import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Token } from 'src/auth/entity/token.entity';
import { Banner } from 'src/banners/entity/banner.entity';
import { Category } from 'src/categories/entity/category.entity';
import { MenuView } from 'src/menus/entity/menu-view.entity';
import { Menu } from 'src/menus/entity/menu.entity';
import { OrderDetail } from 'src/orders/entity/order-detail.entity';
import { Order } from 'src/orders/entity/order.entity';
import { Keyword } from 'src/search/entity/keyword.entity';
import { BusinessDetail } from 'src/stores/entity/business-detail.entity';
import { Franchise } from 'src/stores/entity/franchise.entity';
import { StoreApprove } from 'src/stores/entity/store-approve.entity';
import { StoreDetail } from 'src/stores/entity/store-detail.entity';
import { Store } from 'src/stores/entity/store.entity';
import { Tag } from 'src/tags/entity/tag.entity';
import { Customer } from 'src/users/entity/customer.entity';
import { Seller } from 'src/users/entity/seller.entity';
import { Version } from 'src/version/entity/version.entity';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export const configGenerator = (env: string): TypeOrmModuleOptions => {
    if (env === 'local')
        return {
            type: 'postgres',
            host: process.env.DATABASE_HOST,
            port: Number(process.env.DATABASE_PORT),
            username: process.env.DATABASE_USERNAME,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_NAME,
            synchronize: JSON.parse(process.env.DATABASE_SYNC),
            entities: [__dirname + '/../../**/*.entity.*'],
            logging: true,
            namingStrategy: new SnakeNamingStrategy(),
        };
    else if (env === 'dev' || env === 'stage' || env == 'prod')
        return {
            type: 'postgres',
            host: process.env.DATABASE_HOST,
            port: Number(process.env.DATABASE_PORT),
            username: process.env.DATABASE_USERNAME,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_NAME,
            synchronize: JSON.parse(process.env.DATABASE_SYNC),
            ssl: {
                // Base63로 인코딩되어있는 CRT 디코딩
                ca: Buffer.from(process.env.DATABASE_CRT, 'base64').toString(),
                rejectUnauthorized: true,
            },
            //entities: [__dirname + '/../**/entity.{js,ts}'],
            entities: [
                Store,
                StoreDetail,
                StoreApprove,
                BusinessDetail,
                Seller,
                Customer,
                Menu,
                MenuView,
                Category,
                Token,
                Tag,
                Version,
                Banner,
                Keyword,
                Order,
                OrderDetail,
                Franchise,
            ],
            namingStrategy: new SnakeNamingStrategy(),
        };
};
