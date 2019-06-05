import { User } from './user.entity';
import { Inject, Injectable } from '@nestjs/common';
import { Project } from '../project/project.entity';

@Injectable()
export class UserService {
  constructor(@Inject('UserRepository') private readonly userRepository: typeof User) {}
  createUser = async (user: User) => {
    return await this.userRepository.create(user);
  };

  findUser = async (userTrelloId: string) => {
    return this.userRepository.findOne({
      where: { trelloId: userTrelloId },
      include: [
        {
          model: Project,
          as: 'currentProject',
        },
      ],
    });
  };

  findOrCreateUser = async (userTrelloId: string, fullName: string) => {
    const response = await this.userRepository.findOrCreate({
      where: { trelloId: userTrelloId },
      defaults: { fullName },
      include: [
        {
          model: Project,
          as: 'currentProject',
        },
      ],
    });
    return response[0];
  };
}
