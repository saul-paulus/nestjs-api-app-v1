import { Injectable, UnauthorizedException } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { UserRepository } from 'src/core/domain/repositories/user.repository.interface';
import { JwtTokenService } from 'src/core/infrastructure/services/jwt.service';

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly userRepository: UserRepository<User>,
    private readonly jwtTokenService: JwtTokenService,
  ) {}

  execute = async (email: string, password: string) => {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const isPasswordValid: boolean = await (
      bcrypt as unknown as {
        compare: (s: string | Buffer, hash: string) => Promise<boolean>;
      }
    ).compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }
    const token = this.jwtTokenService.generateToken(user);
    return {
      user_data: user,
      access_token: token,
    };
  };
}
