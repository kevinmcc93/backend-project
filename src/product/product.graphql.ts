import { ObjectType, Field, Float } from '@nestjs/graphql';

@ObjectType()
export class ProductGraphQL {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field(() => Float)
  price: number;
}
