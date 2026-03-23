import { Prisma } from '@prisma/client';

export abstract class UserRepository<T> {
  abstract findByEmail(email: string): Promise<T | null>;
  abstract findById(id: string): Promise<T | null>;
  abstract findAll(tenantId?: string): Promise<T[]>;
  abstract create(data: Prisma.UserCreateInput): Promise<T>;
  abstract update(id: string, data: Prisma.UserUpdateInput): Promise<T>;
  abstract delete(id: string): Promise<T>;
}
