import { Controller, Get, Post, Body, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from './article.entity';
import { User } from './user.entity';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Controller('articles')
export class ArticleController {
  constructor(
    @InjectRepository(Article) private articleRepo: Repository<Article>,
    @InjectRepository(User) private userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  @Get()
  async getAll() {
    return await this.articleRepo.find({ relations: ['author'] });
  }

  @Post()
  async create(@Req() req: Request, @Body() body: { title: string; content: string; subscriberOnly: boolean }) {
    const auth = req.headers['authorization'];
    if (!auth) throw new UnauthorizedException();
    const token = auth.replace('Bearer ', '');
    const payload = this.jwtService.verify(token);
    const user = await this.userRepo.findOne({ where: { id: payload.id } });
    if (!user) throw new UnauthorizedException();
    const article = this.articleRepo.create({
      title: body.title,
      content: body.content,
      subscriberOnly: body.subscriberOnly,
      author: user,
    });
    await this.articleRepo.save(article);
    return { article };
  }
}
