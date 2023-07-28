## Overview

This project is meant to demonstrate my NestJS skills and understanding of web development with graphQL.

There should be two main items in the database, users and products.

The users should have certain properties, including an 'order', which contains a list of products.

You should be able to insert data to Users, and Product entities using the mutations.

Additionally, you can query the entire list of users and see the products in the 'order' for each user.

When the app has been started, it should be available here: http://localhost:3000/graphql

Further schema and documentation can be found by clicking on 'schema' or 'docs' on the right hand side of the page in your browser

## Set up

```bash
# This was developed with the following enviroment
node - v18.17.0
npm - 9.6.7
nest - 10.1.10 
further information can be found in the package.json file
```

## Installation

```bash
$ npm install
```
After this you should verify that the node_modules and package-lock.json are generated

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

```

## Test

```bash
# unit tests
$ npm run test

```

### GraphQL Schema

The API uses GraphQL for data querying and manipulation. Below are the available types, queries, and mutations:

#### Types

- `User`: Represents a user object with `id`, `name`, `email`, `age`, and `orders` fields.
- `Product`: Represents a product object with `id`, `name`, and `price` fields.

#### Queries

- `users`: Retrieves a list of all users with their related orders.
- `products`: Retrieves a list of all products.

#### Fetch All Users

**Example query for users:**

query {
  users {
    id
    name
    email
    age
    orders {
      id
      name
      price
    }
  }
}

**Example response for user query:**

{
  "data": {
    "users": [
      {
        "id": "e97fb94c-8819-4c31-bef5-e00f65fc1be5",
        "name": "John Doe",
        "email": "john@example.com",
        "age": 30,
        "orders": [
          {
            "id": "4d73f697-8968-460e-ad32-9149a3d7154e",
            "name": "Product A",
            "price": 9.99
          },
          {
            "id": "2c6f4b99-fcc0-4a7f-84ac-a2e67a10c7ed",
            "name": "Product B",
            "price": 14.99
          }
        ]
      },
      // More users...
    ]
  }
}

#### Fetch All Products

**Example query for users:**

query {
  products {
    id
    name
    price
  }
}

**Example response for products query:**

{
  "data": {
    "products": [
      {
        "id": "4d73f697-8968-460e-ad32-9149a3d7154e",
        "name": "Product A",
        "price": 9.99
      },
      {
        "id": "2c6f4b99-fcc0-4a7f-84ac-a2e67a10c7ed",
        "name": "Product B",
        "price": 14.99
      },
      {
        "id": "612823e1-a9bf-43c1-a55e-196cc8d346c0",
        "name": "Product C",
        "price": 19.99
      },
      // More products...
    ]
  }
}

#### Mutations

- `createUser(name: String!, email: String!, age: Int!, productIds: [ID!]): User`: Creates a new user. The `productIds` parameter is optional and is used to associate existing products with the user.
- `createProduct(name: String!, price: Float!): Product`: Creates a new product.

**Example mutation to create a user:**

mutation {
  createUser(name: "Jane Smith", email: "jane@example.com", age: 25, productIds: ["4d73f697-8968-460e-ad32-9149a3d7154e", "2c6f4b99-fcc0-4a7f-84ac-a2e67a10c7ed"]) {
    id
    name
    email
    age
    orders {
      id
      name
      price
    }
  }
}


**Example response for user creation mutation:**

{
  "data": {
    "createUser": {
      "id": "d0496c59-1cd9-4cb3-88f7-764f90e10806",
      "name": "Jane Smith",
      "email": "jane@example.com",
      "age": 25,
      "orders": [
        {
          "id": "4d73f697-8968-460e-ad32-9149a3d7154e",
          "name": "Product A",
          "price": 9.99
        },
        {
          "id": "2c6f4b99-fcc0-4a7f-84ac-a2e67a10c7ed",
          "name": "Product B",
          "price": 14.99
        }
      ]
    }
  }
}

**Example mutation to create a product:**

mutation {
  createProduct(name: "New Product", price: 24.99) {
    id
    name
    price
  }
}

**Example response for product creation mutation:**

{
  "data": {
    "createProduct": {
      "id": "3da7949d-0e4e-4541-ac0e-5266ad1b48e4"",
      "name": "New Product",
      "price": 24.99
    }
  }
}
