import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { compare } from 'bcrypt';
import { LoginUseCase } from './login.usecase';
import { UserRepository } from 'src/core/domain/repositories/user.repository.interface';
import { JwtTokenService } from 'src/core/infrastructure/services/jwt.service';
import { User } from '@prisma/client';

jest.mock('bcrypt');

describe('LoginUseCase', () => {
  let useCase: LoginUseCase;
  let userRepository: UserRepository<User>;
  let jwtService: JwtTokenService;

  const mockUser: User = {
    id: '1',
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
        LoginUseCase,
        {
          provide: UserRepository,
          useValue: {
            findByEmail: jest.fn(),
          },
        },
        {
          provide: JwtTokenService,
          useValue: {
            generateToken: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<LoginUseCase>(LoginUseCase);
    userRepository = module.get<UserRepository<User>>(UserRepository);
    jwtService = module.get<JwtTokenService>(JwtTokenService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should throw UnauthorizedException if user not found', async () => {
    jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(null);

    await expect(
      useCase.execute('none@example.com', 'password'),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException if password is invalid', async () => {
    jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(mockUser);
    (compare as jest.Mock).mockResolvedValue(false);

    await expect(
      useCase.execute('test@example.com', 'wrongpassword'),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should return user data and token if login is successful', async () => {
    jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(mockUser);
    (compare as jest.Mock).mockResolvedValue(true);
    jest.spyOn(jwtService, 'generateToken').mockReturnValue('token');

    const result = await useCase.execute('test@example.com', 'password');

    expect(result).toEqual({
      user_data: mockUser,
      access_token: 'token',
    });
  });
});
