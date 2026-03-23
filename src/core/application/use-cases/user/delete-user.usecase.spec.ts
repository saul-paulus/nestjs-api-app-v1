import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { DeleteUserUseCase } from './delete-user.usecase';
import { UserRepository } from 'src/core/domain/repositories/user.repository.interface';
import { User } from '@prisma/client';

describe('DeleteUserUseCase', () => {
  let useCase: DeleteUserUseCase;
  let userRepository: UserRepository<User>;

  const mockUser: User = {
    id: 'user1',
    email: 'test@example.com',
    password: 'hashedPassword',
    username: 'testuser',
    tenant_id: 'tenant1',
    created_at: new Date(),
    updated_at: new Date(),
    deleted_at: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteUserUseCase,
        {
          provide: UserRepository,
          useValue: {
            findById: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<DeleteUserUseCase>(DeleteUserUseCase);
    userRepository = module.get<UserRepository<User>>(UserRepository);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should throw NotFoundException if user not found', async () => {
    jest.spyOn(userRepository, 'findById').mockResolvedValue(null);

    await expect(useCase.execute('none')).rejects.toThrow(NotFoundException);
  });

  it('should delete user if found', async () => {
    jest.spyOn(userRepository, 'findById').mockResolvedValue(mockUser);

    await useCase.execute('user1');

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(userRepository.delete).toHaveBeenCalledWith('user1');
  });
});
