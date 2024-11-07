import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: loginDto.email } });

    if (!user) {
      throw new BadRequestException('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(loginDto.password, user.password);

    if (!isMatch) {
      throw new BadRequestException('Invalid email or password');
    }

    // Create the JWT payload with user ID, email, and role
    const payload = { sub: user.id, email: user.email };

    return {
      token: this.jwtService.sign(payload),
      user: { id: user.id, email: user.email, name: user.name },
    };
  }
}
