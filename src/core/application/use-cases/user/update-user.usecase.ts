import { Injectable, NotFoundException } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { User, Prisma } from '@prisma/client';
import { UserRepository } from 'src/core/domain/repositories/user.repository.interface';
import { UpdateUserDto } from 'src/core/application/dto/user/update-user.dto';

@Injectable()
export class UpdateUserUseCase {
  constructor(private readonly userRepository: UserRepository<User>) {}

  execute = async (id: string, data: UpdateUserDto) => {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updateData: Prisma.UserUpdateInput = {
      email: data.email,
      username: data.username,
    };

    if (data.password) {
      const hashedPassword = await (
        bcrypt as unknown as {
          hash: (
            s: string | Buffer,
            saltOrRounds: string | number,
          ) => Promise<string>;
        }
      ).hash(data.password, 10);
      updateData.password = hashedPassword;
    }

    return this.userRepository.update(id, updateData);
  };
}
