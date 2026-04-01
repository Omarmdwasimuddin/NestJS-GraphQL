## Build Full GraphQL CRUD App with MongoDB & NestJS

##### Install---

```bash
npm i @nestjs/config
npm i @nestjs/mongoose mongoose
```

##### Create .env file from root
##### Mongodb atlas er database url .env file e rakho

#### .env
```bash
MONGODB_DATABASE_URL=mongodb+srv://abutaherrnb64_db_user:7PcXTNZMcwpZaaQG@cluster0.pfwfa6z.mongodb.net/?appName=Cluster0
```

##### Install---

```bash
npm i @nestjs/graphql @nestjs/apollo @apollo/server @as-integrations/express5 class-transformer class-validator graphql
```

##### app.module.ts e add koro- imports e ConfigModule, GraphQLModule, MongooseModule

#### app.module.ts
```bash
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookModule } from './book/book.module';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    BookModule,
    ConfigModule.forRoot({ isGlobal: true }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_DATABASE_URL!),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

##### Create---

```bash
nest g module book
nest g service book
nest g resolver book/resolvers/book --flat
```

##### file-folder create koro- book/dto/create-book.input.ts , book/dto/update-book.input.ts & book/model/book.model.ts

#### book.model.ts
```bash
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { ObjectType, Field, ID } from "@nestjs/graphql";

@Schema()
@ObjectType()
export class Book {

    @Field(() => ID)
    _id: string;

    @Prop({ required: true })
    @Field()
    title: string;

    @Prop({ nullable: true })
    @Field()
    description?: string;

    @Prop({ required: true })
    @Field()
    author: string;

}

export type BookDocument = HydratedDocument<Book>;
export const BookSchema = SchemaFactory.createForClass(Book);
```

#### book.module.ts
```bash
import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookResolver } from './resolvers/book.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Book, BookSchema } from './model/book.model';

@Module({
  imports: [ MongooseModule.forFeature([{ name: Book.name, schema: BookSchema }]) ],
  providers: [BookService, BookResolver]
})
export class BookModule {}
```

#### create-book.input.ts
```bash

```