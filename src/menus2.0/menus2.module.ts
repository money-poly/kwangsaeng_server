import { Module } from '@nestjs/common';
import { Menus2Service } from './menus2.service';
import { Menus2Controller } from './menus2.controller';
import { Menus2Appender } from './implement/menus2.appender';
import { Menus2Reader } from './implement/menus2.reader';
import { Menus2Manager } from './implement/menus2.manager';

@Module({
    providers: [Menus2Service, Menus2Appender, Menus2Reader, Menus2Manager],
    controllers: [Menus2Controller],
})
export class Menus2Module {}
