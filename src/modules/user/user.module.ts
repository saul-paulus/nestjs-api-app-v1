import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserController } from './user.controller';
import { FindAllUsersUseCase } from 'src/core/application/use-cases/user/find-all-users.usecase';
import { FindUserByIdUseCase } from 'src/core/application/use-cases/user/find-user-by-id.usecase';
import { CreateUserUseCase } from 'src/core/application/use-cases/user/create-user.usecase';
import { UpdateUserUseCase } from 'src/core/application/use-cases/user/update-user.usecase';
import { DeleteUserUseCase } from 'src/core/application/use-cases/user/delete-user.usecase';
import { UserRepository } from 'src/core/domain/repositories/user.repository.interface';
import { PrismaUserRepository } from 'src/core/infrastructure/prisma/repositories/prisma-user.repository';
import { JwtTokenService } from 'src/core/infrastructure/services/jwt.service';

@Module({
  imports: [JwtModule.register({})], // Used for JwtTokenService inside JwtAuthGuard if needed
  controllers: [UserController],
  providers: [
    FindAllUsersUseCase,
    FindUserByIdUseCase,
    CreateUserUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    JwtTokenService,
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
  ],
})
export class UserModule {}
