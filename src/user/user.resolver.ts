import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { NotFoundException } from '@nestjs/common';
import { UserService } from './user.service';
import { UserGraphQL } from './user.graphql';
import { User } from './user.entity';
import { v4 as uuidv4 } from 'uuid';
import { Product } from '../product/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';

@Resolver(() => UserGraphQL)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  @Query(() => [UserGraphQL])
  async users(): Promise<User[]> {
    const fetchedUsers = await this.userService.findAll();
    return fetchedUsers;
  }

  @Mutation(() => UserGraphQL)
  async createUser(
    @Args('name') name: string,
    @Args('email') email: string,
    @Args('age') age: number,
    @Args('productIds', { type: () => [String], nullable: true })
    productIds: string[],
  ): Promise<User> {
    const id = uuidv4();
    const user: User = { id, name, email, age };

    if (productIds && productIds.length > 0) {
      const products = await this.productRepository.find({
        where: { id: In(productIds) },
      });

      if (products.length !== productIds.length) {
        throw new NotFoundException('One or more products not found.');
      }

      user.orders = products; // Assign the array of products to the user's orders
    }

    return this.userService.create(user);
  }

  @ResolveField() // Define the resolver for the 'orders' field
  async orders(@Parent() user: User): Promise<Product[]> {
    if (user.orders) {
      const orderIds = user.orders.map((order) => order.id);
      return this.productRepository.findByIds(orderIds);
    }
    return [];
  }
}
