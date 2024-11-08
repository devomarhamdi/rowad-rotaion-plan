import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { Response as ExpressResponse } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto, res: ExpressResponse) {
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

    // Generate the token
    const token = this.jwtService.sign(payload);

    // Set the JWT token as an HTTP-only cookie
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    });

    // Return user details, but not the token in the response body
    return res.send({
      message: 'Login successful',
      user: { id: user.id, email: user.email, name: user.name },
    });
  }
}
