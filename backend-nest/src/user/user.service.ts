import { User } from './user.entity';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(@Inject('UserRepository') private readonly userRepository: typeof User) {}
  createUser = async (user: User) => {
    return await this.userRepository.create(user);
  };

  findUser = async (userTrelloId: string) => {
    return this.userRepository.findOne({
      where: { trelloId: userTrelloId },
    });
  };

  // TODO: add include
  findOrCreateUser = async (userTrelloId: string, fullName: string) => {
    const response = await this.userRepository.findOrCreate({
      where: { trelloId: userTrelloId },
      defaults: { fullName },
    });
    return response[0];
  };
}
