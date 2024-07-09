import { Module } from '@nestjs/common';
import { Stores2Service } from './stores2.service';
import { Stores2Controller } from './stores2.controller';
import { Stores2Appender } from './implement/stores2.appender';
import { Stores2Manager } from './implement/stores2.manager';
import { Stores2Reader } from './implement/stores2.reader';
import { Stores2Repository } from './stores2.repository';

@Module({
    providers: [Stores2Service, Stores2Appender, Stores2Manager, Stores2Reader, Stores2Repository],
    controllers: [Stores2Controller],
})
export class Stores2Module {}
