import { Injectable, ConflictException } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { UserRepository } from 'src/core/domain/repositories/user.repository.interface';
import { JwtTokenService } from 'src/core/infrastructure/services/jwt.service';

import { RegisterDto } from 'src/modules/auth/dto/register.dto';

@Injectable()
export class RegisterUseCase {
  constructor(
    private readonly userRepository: UserRepository<User>,
    private readonly jwtTokenService: JwtTokenService,
  ) {}

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

    const newUser = await this.userRepository.create({
      email: data.email,
      password: hashedPassword,
      username: data.username,
      tenant: {
        connect: {
          tenant_id: data.tenant_id,
        },
      },
    });

    const token = this.jwtTokenService.generateToken(newUser);

    return {
      user_data: newUser,
      access_token: token,
    };
  };
}
