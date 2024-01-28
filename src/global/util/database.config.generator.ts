import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Token } from 'src/auth/entity/token.entity';
import { Banner } from 'src/banners/entity/banner.entity';
import { Category } from 'src/categories/entity/category.entity';
import { MenuView } from 'src/menus/entity/menu-view.entity';
import { Menu } from 'src/menus/entity/menu.entity';
import { Keyword } from 'src/search/entity/keyword.entity';
import { BusinessDetail } from 'src/stores/entity/business-detail.entity';
import { StoreApprove } from 'src/stores/entity/store-approve.entity';
import { StoreDetail } from 'src/stores/entity/store-detail.entity';
import { Store } from 'src/stores/entity/store.entity';
import { Tag } from 'src/tags/entity/tag.entity';
import { User } from 'src/users/entity/user.entity';
import { Version } from 'src/version/entity/version.entity';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export const configGenerator = (env: string): TypeOrmModuleOptions => {
    if (env === 'local')
        return {
            type: 'mysql',
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
    else if (env === 'dev')
        return {
            type: 'mysql',
            host: process.env.DATABASE_HOST,
            port: Number(process.env.DATABASE_PORT),
            username: process.env.DATABASE_USERNAME,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_NAME,
            synchronize: JSON.parse(process.env.DATABASE_SYNC),
            ssl: {
                rejectUnauthorized: true,
            },
            //entities: [__dirname + '/../**/entity.{js,ts}'],
            entities: [
                Store,
                StoreDetail,
                StoreApprove,
                BusinessDetail,
                User,
                Menu,
                MenuView,
                Category,
                Token,
                Tag,
                Version,
                Banner,
                Keyword,
            ],
            namingStrategy: new SnakeNamingStrategy(),
        };
};
