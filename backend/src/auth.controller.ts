import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';

@Controller('auth')
export class AuthController {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  @Post('register')
  async register(@Body() body: { username: string; email: string; password: string }) {
    const exists = await this.userRepo.findOne({ where: [{ email: body.email }, { username: body.username }] });
    if (exists) throw new UnauthorizedException('User already exists');
    const user = this.userRepo.create({
      username: body.username,
      email: body.email,
      password: await bcrypt.hash(body.password, 10),
    });
    await this.userRepo.save(user);
    return { message: 'User registered' };
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const user = await this.userRepo.findOne({ where: { email: body.email } });
    if (!user || !(await bcrypt.compare(body.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { id: user.id, username: user.username, email: user.email, isSubscriber: user.isSubscriber };
    const token = this.jwtService.sign(payload);
    return { user: { ...payload, token } };
  }
}
