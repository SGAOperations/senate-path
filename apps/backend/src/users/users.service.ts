import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { CreateUserRequestDto } from './dto/create-user-request.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getUsers(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async createUser(userColumns: CreateUserRequestDto): Promise<User> {
    return this.prisma.user.create({
      data: userColumns,
    });
  }
}
