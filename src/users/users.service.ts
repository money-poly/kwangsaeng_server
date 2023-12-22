import { UsersRepository } from 'src/users/users.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
    constructor(private readonly usersRepository: UsersRepository) {}

    async findOne(id: number) {
        return await this.usersRepository.findOne({ id });
    }
}
