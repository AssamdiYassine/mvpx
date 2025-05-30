import { Controller, Post, Req, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from './subscription.entity';
import { User } from './user.entity';
import { JwtService } from '@nestjs/jwt';
import Stripe from 'stripe';
import { Request } from 'express';

@Controller('subscribe')
export class SubscriptionController {
  constructor(
    @InjectRepository(Subscription) private subRepo: Repository<Subscription>,
    @InjectRepository(User) private userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  @Post()
  async subscribe(@Req() req: Request) {
    const auth = req.headers['authorization'];
    if (!auth) throw new UnauthorizedException();
    const token = auth.replace('Bearer ', '');
    const payload = this.jwtService.verify(token);
    const user = await this.userRepo.findOne({ where: { id: payload.id } });
    if (!user) throw new UnauthorizedException();
    // Stripe logic (demo: just mark as subscriber)
    user.isSubscriber = true;
    await this.userRepo.save(user);
    return { message: 'Subscribed' };
  }
}
