import { Injectable, Logger } from '@nestjs/common';
import { CommonException } from 'src/global/exception/common.exception';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';

@Injectable()
export class UsersService {
    constructor(private readonly logger: Logger) {}
    private userRepository: Repository<User>;

    async createSeller(dto): Promise<User> {
        const user = new User();
        user.fId = dto.fId;

        try {
            return await this.userRepository.save(user);
        } catch (e) {
            this.logger.error(e);
            throw new CommonException(999, 'failed to create user');
        }
    }
}
