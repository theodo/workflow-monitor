import { User } from './user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { UserDto } from './interfaces/user.dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  createUser = async (userDto: UserDto) => {
    return await this.save(userDto);
  };

  findOneUser = async (id: string) => {
    return this.findOneOrFail(id);
  };

  updateUser = async (id: string, userDto: UserDto) => {
    return this.save({ ...userDto, id: Number(id) });
  };

  removeUser = async (id: string) => {
    await this.findOneOrFail(id);
    return this.delete(id);
  };
}
