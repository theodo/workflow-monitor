import { TypeOrmModule } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { getConnection } from 'typeorm';

import { UserController } from './user.controller';
import { UserDto } from './interfaces/user.dto';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

const USER_1: UserDto = { name: 'name1', email: 'email1', password: 'password1', roles: ['user'] };
const USER_2: UserDto = { name: 'name2', email: 'email2', password: 'password2', roles: ['admin'] };

describe('UserController', () => {
  let userController: UserController;
  let userRepository: UserRepository;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(), TypeOrmModule.forFeature([User, UserRepository])],
      controllers: [UserController],
      providers: [UserService],
    }).compile();

    userController = app.get<UserController>(UserController);
    userRepository = app.get<UserRepository>(UserRepository);
    await userRepository.clear();
  });

  afterEach(async () => {
    await userRepository.clear();
  });

  afterAll(async () => {
    await getConnection().close();
  });

  describe('user', () => {
    it('should find all users', async () => {
      const createdUser = await userRepository.createUser(USER_1);
      expect(await userController.findAll()).toEqual([createdUser]);
    });

    it('should find a user by id', async () => {
      await userRepository.createUser(USER_1);
      const createdUser = await userRepository.createUser(USER_2);
      const createdUserId = createdUser.id.toString();
      expect(await userController.findOne(createdUserId)).toEqual(createdUser);
    });

    it('should create a user', async () => {
      const createdUser = await userController.create(USER_1);
      const createdUserId = createdUser.id.toString();
      const { password, ...storedUserWithPassword } = await userRepository.findOneUser(
        createdUserId,
      );
      expect(storedUserWithPassword).toEqual(createdUser);
    });

    it('should update a user', async () => {
      const { id } = await userRepository.createUser(USER_1);
      const createdUserId = id.toString();
      const updatedUser = await userController.update(createdUserId, USER_2);
      expect(await userRepository.findOne(createdUserId)).toEqual(updatedUser);
    });

    it('should delete a user', async () => {
      const { id } = await userRepository.createUser(USER_1);
      const createdUserId = id.toString();
      await userController.remove(createdUserId);
      expect(await userRepository.findOne(createdUserId)).toBe(undefined);
    });
  });
});
