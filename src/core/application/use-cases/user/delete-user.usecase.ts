import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { UserRepository } from 'src/core/domain/repositories/user.repository.interface';

@Injectable()
export class DeleteUserUseCase {
  constructor(private readonly userRepository: UserRepository<User>) {}

  execute = async (id: string) => {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.userRepository.delete(id);
  };
}
