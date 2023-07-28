import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { Product } from './product.entity';
import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Resolver(() => Product)
export class ProductResolver {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  @Query(() => Product)
  async product(@Args('id') productId: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  @Query(() => [Product])
  async products(): Promise<Product[]> {
    return this.productRepository.find();
  }

  @Mutation(() => Product)
  async createProduct(
    @Args('name') name: string,
    @Args('price') price: number,
  ): Promise<Product> {
    const id = uuidv4();
    const product: Product = { id, name, price };
    return this.productRepository.save(product);
  }
}
