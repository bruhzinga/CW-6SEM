import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/user.create.dto';
import { LoginUserDto } from './dto/user-login.dto';
import { comparePasswords } from 'src/shared/utils';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findByLogin({ username, password }: LoginUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { username },
      include: { Role: true },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    }

    // compare passwords
    const areEqual = await comparePasswords(user.password, password);

    if (!areEqual) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    return user;
  }

  async findIDbyLogin(username: string) {
    const user = await this.prisma.user.findUnique({
      where: { username },
    });
    return user.id;
  }

  async findByPayload({ username }: any) {
    const user = this.prisma.user.findFirst({
      where: { username },
      include: { Role: true },
    });
    return user;
  }

  async create(userDto: CreateUserDto) {
    const { username, email, role } = userDto;
    const password = await bcrypt.hash(userDto.password, 10);

    // check if user exists in db
    const userInDb = await this.prisma.user.findFirst({
      where: { username },
      include: { Role: true },
    });

    if (userInDb) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    return this.prisma.user.create({
      data: {
        username,
        password,
        email,
        Role: {
          connect: {
            name: role.toString(),
          },
        },
      },
    });
  }
}
