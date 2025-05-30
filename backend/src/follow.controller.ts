import { Controller, Post, Body, Req, UnauthorizedException, Get } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Follow } from './follow.entity';
import { User } from './user.entity';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Controller('follow')
export class FollowController {
  constructor(
    @InjectRepository(Follow) private followRepo: Repository<Follow>,
    @InjectRepository(User) private userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  @Post()
  async follow(@Req() req: Request, @Body() body: { userId: number }) {
    const auth = req.headers['authorization'];
    if (!auth) throw new UnauthorizedException();
    const token = auth.replace('Bearer ', '');
    const payload = this.jwtService.verify(token);
    const follower = await this.userRepo.findOne({ where: { id: payload.id } });
    const following = await this.userRepo.findOne({ where: { id: body.userId } });
    if (!follower || !following) throw new UnauthorizedException();
    const exists = await this.followRepo.findOne({ where: { follower, following } });
    if (exists) return { message: 'Already following' };
    const follow = this.followRepo.create({ follower, following });
    await this.followRepo.save(follow);
    return { message: 'Followed' };
  }

  @Get('list')
  async list(@Req() req: Request) {
    const auth = req.headers['authorization'];
    if (!auth) throw new UnauthorizedException();
    const token = auth.replace('Bearer ', '');
    const payload = this.jwtService.verify(token);
    const user = await this.userRepo.findOne({ where: { id: payload.id } });
    if (!user) throw new UnauthorizedException();
    const following = await this.followRepo.find({ where: { follower: user }, relations: ['following'] });
    return { following: following.map(f => ({ id: f.following.id, username: f.following.username })) };
  }
}
