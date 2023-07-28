import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), ProductModule],
  providers: [UserService, UserResolver],
})
export class UserModule {}
