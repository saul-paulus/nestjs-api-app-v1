/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { hash } from 'bcrypt';
import { UpdateUserUseCase } from './update-user.usecase';
import { UserRepository } from 'src/core/domain/repositories/user.repository.interface';
import { User } from '@prisma/client';

jest.mock('bcrypt');

describe('UpdateUserUseCase', () => {
  let useCase: UpdateUserUseCase;
  let userRepository: UserRepository<User>;

  const mockUser: User = {
    id: 'user1',
    email: 'old@example.com',
    password: 'oldHashedPassword',
    username: 'olduser',
    tenant_id: 'tenant1',
    created_at: new Date(),
    updated_at: new Date(),
    deleted_at: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateUserUseCase,
        {
          provide: UserRepository,
          useValue: {
            findById: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<UpdateUserUseCase>(UpdateUserUseCase);
    userRepository = module.get<UserRepository<User>>(UserRepository);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should throw NotFoundException if user not found', async () => {
    jest.spyOn(userRepository, 'findById').mockResolvedValue(null);

    await expect(useCase.execute('none', {})).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should update user without password hashing if password is not provided', async () => {
    jest.spyOn(userRepository, 'findById').mockResolvedValue(mockUser);
    const updateData = { username: 'newname' };
    await useCase.execute('user1', updateData);

    expect(userRepository.update).toHaveBeenCalledWith('user1', {
      email: undefined,
      username: 'newname',
    });
  });

  it('should hash password and update user if password is provided', async () => {
    jest.spyOn(userRepository, 'findById').mockResolvedValue(mockUser);
    (hash as jest.Mock).mockResolvedValue('newHashedPassword');

    await useCase.execute('user1', { password: 'newpassword' });

    expect(userRepository.update).toHaveBeenCalledWith('user1', {
      email: undefined,
      username: undefined,
      password: 'newHashedPassword',
    });
  });
});
