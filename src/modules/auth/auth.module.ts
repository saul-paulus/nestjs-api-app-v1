import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoginUseCase } from 'src/core/application/use-cases/auth/login.usecase';
import { RegisterUseCase } from 'src/core/application/use-cases/auth/register.usecase';
import { GetProfileUseCase } from 'src/core/application/use-cases/auth/get-profile.usecase';
import { JwtTokenService } from 'src/core/infrastructure/services/jwt.service';
import { AuthController } from './auth.controller';
import { UserRepository } from 'src/core/domain/repositories/user.repository.interface';
import { PrismaUserRepository } from 'src/core/infrastructure/prisma/repositories/prisma-user.repository';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          expiresIn: configService.get<string>('JWT_EXPIRES_IN') as any,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    LoginUseCase,
    RegisterUseCase,
    GetProfileUseCase,
    JwtTokenService,
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
  ],
})
export class AuthModule {}
