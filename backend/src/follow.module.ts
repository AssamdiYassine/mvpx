import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { Follow } from './follow.entity';
import { FollowController } from './follow.controller';
import { User } from './user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Follow, User]), JwtModule],
  controllers: [FollowController],
  providers: [],
  exports: [],
})
export class FollowModule {}
