import { Injectable } from '@nestjs/common';
import { hash } from 'bcrypt';

import { UserRepository } from './user.repository';
import { UserDto } from './interfaces/user.dto';

const SALT_ROUNDS = 10;

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  createUser = async (userDto: UserDto) => {
    const plainPassword = userDto.password;
    const encryptedPassword = await hash(plainPassword, SALT_ROUNDS);
    const createdUser = await this.userRepository.save({ ...userDto, password: encryptedPassword });
    const { password, ...createdUserDto } = createdUser;
    return createdUserDto;
  };
}
