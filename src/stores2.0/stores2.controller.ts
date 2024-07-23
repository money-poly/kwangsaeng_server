import { Controller } from '@nestjs/common';
import { Stores2Service } from './stores2.service';

@Controller('stores2')
export class Stores2Controller {
    constructor(private readonly StoresService: Stores2Service) {}
}
