import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { LoginUseCase } from 'src/core/application/use-cases/auth/login.usecase';
import { RegisterUseCase } from 'src/core/application/use-cases/auth/register.usecase';
import { GetProfileUseCase } from 'src/core/application/use-cases/auth/get-profile.usecase';
import { JwtTokenService } from 'src/core/infrastructure/services/jwt.service';
import { LoginDto } from './dto/login.dto';
import { User } from '@prisma/client';

describe('AuthController', () => {
  let controller: AuthController;
  let loginUseCase: LoginUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: LoginUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: RegisterUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: GetProfileUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: JwtTokenService,
          useValue: {
            verifyToken: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    loginUseCase = module.get<LoginUseCase>(LoginUseCase);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should call loginUseCase.execute with correct parameters', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      const mockUser: User = {
        id: '1',
        email: 'test@example.com',
        password: 'password123',
        username: 'testuser',
        tenant_id: '1',
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: new Date(),
      };
      const expectedResult = {
        user_data: mockUser,
        access_token: 'token',
      };
      jest.spyOn(loginUseCase, 'execute').mockResolvedValue(expectedResult);

      const result = await controller.login(loginDto);

      expect(loginUseCase.execute).toHaveBeenCalledWith(
        loginDto.email,
        loginDto.password,
      );
      expect(result).toBe(expectedResult);
    });
  });
});
