import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { UserRepository } from 'src/core/domain/repositories/user.repository.interface';
import { User, Prisma } from '@prisma/client';

@Injectable()
export class PrismaUserRepository implements UserRepository<User> {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findAll(tenantId?: string): Promise<User[]> {
    return this.prisma.user.findMany({
      where: tenantId ? { tenant_id: tenantId } : {},
    });
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data });
  }

  async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<User> {
    return this.prisma.user.delete({ where: { id } });
  }
}
