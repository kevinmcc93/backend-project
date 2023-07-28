import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { ProductModule } from '../src/product/product.module';
import { Product } from '../src/product/product.entity';
import { UserModule } from '../src/user/user.module';
import { User } from '../src/user/user.entity';
import { ProductResolver } from '../src/product/product.resolver';
import { UserResolver } from '../src/user/user.resolver';
import { UserService } from '../src/user/user.service';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { NotFoundException } from '@nestjs/common';


describe('ProductResolver', () => {
  let productResolver: ProductResolver;
  let productRepository: Repository<Product>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ProductModule, // Include the ProductModule for testing the ProductResolver
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Product],
          synchronize: true,
        }),
      ],
      providers: [ProductResolver],
    }).compile();

    productResolver = module.get<ProductResolver>(ProductResolver);
    productRepository = module.get<Repository<Product>>(getRepositoryToken(Product));
  });

  describe('createProduct', () => {
    it('should create a new product and return it', async () => {
      const name = 'Test Product';
      const price = 9.99;

      const createdProduct = await productResolver.createProduct(name, price);

      expect(createdProduct).toBeDefined();
      expect(createdProduct.name).toBe(name);
      expect(createdProduct.price).toBe(price);
    });
  });

  describe('products', () => {
    it('should return a list of products', async () => {
      const products = await productResolver.products();

      expect(products).toBeDefined();
      expect(Array.isArray(products)).toBe(true);
    });
  });

  // Add more test cases for other functionality in the ProductResolver if needed
});

describe('UserResolver', () => {
  let userResolver: UserResolver;
  let userRepository: Repository<User>;
  let productResolver: ProductResolver;
  let productService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        UserModule, // Include the UserModule for testing the UserResolver
        ProductModule, // Include the ProductModule for creating related products
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [User, Product],
          synchronize: true,
        }),
      ],
      providers: [
        UserResolver,
        UserService,
        ProductResolver,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Product),
          useClass: Repository,
        },
      ],
    }).compile();

    userResolver = module.get<UserResolver>(UserResolver);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    productResolver = module.get<ProductResolver>(ProductResolver);
    productService = module.get<UserService>(UserService);
  });

  describe('createUser', () => {
    it('should create a new user with existing products and return it', async () => {
      const name = 'Test User';
      const email = 'test@example.com';
      const age = 25;
    
      // Create a new product first
      const productName = 'Test Product';
      const productPrice = 9.99;
      const createdProduct = await productResolver.createProduct(productName, productPrice);
    
      console.log('Created Product:', createdProduct);
    
      // Create the user with the existing product
      const createdUser = await userResolver.createUser(name, email, age, [createdProduct.id]);
    
      console.log('Created User:', createdUser);
    
      expect(createdUser).toBeDefined();
      expect(createdUser.name).toBe(name);
      expect(createdUser.email).toBe(email);
      expect(createdUser.age).toBe(age);
      expect(createdUser.orders).toBeDefined();
      expect(createdUser.orders.length).toBe(1);
      expect(createdUser.orders[0].id).toBe(createdProduct.id);
    });

    it('should create a new user with a non-existing product and throw an error', async () => {
      const name = 'Test User';
      const email = 'test@example.com';
      const age = 25;

      // Use a random non-existing product ID
      const nonExistingProductId = uuidv4();

      try {
        await userResolver.createUser(name, email, age, [nonExistingProductId]);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('One or more products not found.');
      }
    });
  });
});

