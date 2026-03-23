import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { UserRepository } from 'src/core/domain/repositories/user.repository.interface';

@Injectable()
export class FindAllUsersUseCase {
  constructor(private readonly userRepository: UserRepository<User>) {}

  execute = async (tenantId?: string) => {
    return this.userRepository.findAll(tenantId);
  };
}
