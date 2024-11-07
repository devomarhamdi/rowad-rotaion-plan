import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  async create(createUserDto: CreateUserDto) {
    const isExist = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (isExist) {
      throw new NotFoundException('This account already exist');
    }

    const salt = await bcrypt.genSalt();
    const password = createUserDto.password;
    const hash = await bcrypt.hash(password, salt);

    const user = await this.prisma.user.create({
      data: {
        email: createUserDto.email,
        name: createUserDto.name,
        password: hash,
      },
    });

    return user;
  }

  async findAll() {
    const users = await this.prisma.user.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    const length = await this.prisma.user.count();

    if (!users || length === 0) {
      throw new NotFoundException('There are no users');
    }

    return {
      length,
      data: users,
    };
  }

  async findOne(id: number) {
    const isExist = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!isExist) {
      throw new NotFoundException('User not found');
    }

    return isExist;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const isExist = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!isExist) {
      throw new NotFoundException('User not found');
    }

    let hash;

    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt();
      const password = updateUserDto.password;
      hash = await bcrypt.hash(password, salt);

      return hash;
    }

    const user = await this.prisma.user.update({
      where: { id },
      data: {
        ...updateUserDto,
        password: updateUserDto.password ? hash : isExist.password,
      },
    });

    return user;
  }

  async remove(id: number) {
    const isExist = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!isExist) {
      throw new NotFoundException('User not found');
    }

    const user = await this.prisma.user.delete({
      where: { id },
    });

    return user;
  }
}
