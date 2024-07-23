import { Injectable } from '@nestjs/common';
import { Stores2Reader } from './implement/stores2.reader';

@Injectable()
export class Stores2Service {
    constructor(private readonly StoresReader: Stores2Reader) {}
}
