import { Module } from '@nestjs/common';
import { VersionService } from './version.service';
import { VersionController } from './version.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Version } from './entity/version.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Version])],
    controllers: [VersionController],
    providers: [VersionService],
})
export class VersionModule {}
