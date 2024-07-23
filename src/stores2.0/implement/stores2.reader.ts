import { Injectable } from '@nestjs/common';
import { Stores2Repository } from '../stores2.repository';

@Injectable()
export class Stores2Reader {
    constructor(private readonly storesRepository: Stores2Repository) {}
}
