import { ObjectType, Field } from '@nestjs/graphql';
import { ProductGraphQL } from '../product/product.graphql';

@ObjectType()
export class UserGraphQL {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  age: number;

  @Field(() => [ProductGraphQL], { nullable: true })
  orders?: ProductGraphQL[];
}
