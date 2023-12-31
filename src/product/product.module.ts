import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { ProductResolver } from './product.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  providers: [ProductResolver],
  exports: [TypeOrmModule.forFeature([Product])],
})
export class ProductModule {}
