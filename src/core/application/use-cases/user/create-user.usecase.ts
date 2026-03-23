import { Injectable, ConflictException } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { UserRepository } from 'src/core/domain/repositories/user.repository.interface';
import { RegisterDto } from 'src/modules/auth/dto/register.dto';

@Injectable()
export class CreateUserUseCase {
  constructor(private readonly userRepository: UserRepository<User>) {}

  execute = async (data: RegisterDto) => {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await (
      bcrypt as unknown as {
        hash: (
          s: string | Buffer,
          saltOrRounds: string | number,
        ) => Promise<string>;
      }
    ).hash(data.password, 10);

    return this.userRepository.create({
      email: data.email,
      password: hashedPassword,
      username: data.username,
      tenant: {
        connect: {
          tenant_id: data.tenant_id,
        },
      },
    });
  };
}
