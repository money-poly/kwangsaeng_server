// import { EntityRepository, Repository } from 'typeorm';
// import { User } from './user.entity';

// @EntityRepository(User)
// export class UserRepository extends Repository<User> {
//   async findAll(): Promise<User[]> {
//     return this.find();
//   }

//   async findById(id: number): Promise<User | undefined> {
//     return this.findOne(id);
//   }

//   async create(user: CreateUserDto): Promise<User> {
//     const newUser = this.create(user);
//     return this.save(newUser);
//   }

//   async update(id: number, updateUserDto: UpdateUserDto): Promise<User | undefined> {
//     const user = await this.findById(id);
//     if (!user) return undefined;

//     Object.assign(user, updateUserDto);
//     return this.save(user);
//   }

//   async delete(id: number): Promise<boolean> {
//     const result = await this.delete(id);
//     return result.affected > 0;
//   }
// };