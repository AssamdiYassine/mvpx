import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { Subscription } from './subscription.entity';
import { SubscriptionController } from './subscription.controller';
import { User } from './user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Subscription, User]), JwtModule],
  controllers: [SubscriptionController],
  providers: [],
  exports: [],
})
export class SubscriptionModule {}
