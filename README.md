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
import { InputType, Field } from "@nestjs/graphql";
import { IsNotEmpty, IsString } from "class-validator";

@InputType()
export class CreateBookInput {
    @Field()
    @IsString()
    @IsNotEmpty()
    title: string;

    @Field({ nullable: true })
    @IsString()
    description?: string;

    @Field()
    @IsString()
    @IsNotEmpty()
    author: string;
}
```

#### update-book.input.ts
```bash
import { CreateBookInput } from "./create-book.input";
import { InputType, Field, PartialType, ID } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";

@InputType()
export class UpdateBookInput extends PartialType(CreateBookInput) {
    @Field(() => ID)
    @IsNotEmpty()
    id: string;
}
```

#### book.service.ts
```bash
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Book } from './model/book.model';
import { Model } from 'mongoose';
import { CreateBookInput } from './dto/create-book.input';
import { UpdateBookInput } from './dto/update-book.input';

@Injectable()
export class BookService {
    constructor( @InjectModel(Book.name) private bookModel: Model<Book> ) {}

    async create(input: CreateBookInput): Promise<Book> {
        const createdBook = new this.bookModel(input);
        return createdBook.save();
    }

    async findAll(): Promise<Book[]> {
        return this.bookModel.find().exec();
    }

    async findOne(id: string): Promise<Book> {
        const book = await this.bookModel.findById(id).exec();
        if (!book) throw new NotFoundException(`Book not found!`);
        return book;
    }

    async update(input: UpdateBookInput): Promise<Book> {
        const existingBook = await this.bookModel.findById(input.id);
        if (!existingBook) throw new NotFoundException(`Book not found!`);

        Object.assign(existingBook, input);
        return existingBook.save();
    }

    async delete(id: string): Promise<boolean> {
        const deletedBook = await this.bookModel.findByIdAndDelete(id);
        if (!deletedBook) throw new NotFoundException(`Book not found!`);
        return true;
    }

}
```

#### book.resolver.ts
```bash
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BookService } from '../book.service';
import { Book } from '../model/book.model';
import { CreateBookInput } from '../dto/create-book.input';
import { UpdateBookInput } from '../dto/update-book.input';

@Resolver()
export class BookResolver {

    constructor( private readonly bookService: BookService ) {}

    @Query(() => [Book], { name: "getAllBooks" })
    async getAllBooks() {
        return this.bookService.findAll();
    }

    @Query(() => Book, { name: "getBookById" })
    async getBookById(@Args('id', { type: () => String }) id: string) {
        return this.bookService.findOne(id);
    }

    @Mutation(() => Book)
    async createBook(@Args('input') input: CreateBookInput) {
        return this.bookService.create(input);
    }

    @Mutation(() => Book)
    async updateBook(@Args('id') input: UpdateBookInput) {
        return this.bookService.update(input);
    }

    @Mutation(() => Boolean)
    async deleteBook(@Args('id', { type: () => String }) id: string) {
        return this.bookService.delete(id);
    }

}
```

##### visit--- localhost:3000/graphql

```bash
# mutation {
#   createBook(input: {
#     title: "Hello...nestjs",
#     description: "Nestjs is joss...working!",
#     author: "Wasim"
#   }){
#     _id,
#     title,
#     author
#   }
# }

# query {
#   getAllBooks {
#     _id,
#     title,
#     author
#   }
# }

# query {
#   getBookById(id:"69cce170b94f07539d3f3909") {
#     _id,
#     title,
#     author
#   }
# }

# mutation {
#   deleteBook (id:"69cce170b94f07539d3f3909")
# }

mutation {
  updateBook(input:{
    id:"69cce5b2b94f07539d3f3910",
    title: "GraphQL is awesome!",
    description: "joss!",
    author: "Wasim Uddin"
  }){
    _id,
    title,
    author
  }
}
```

#### Output view---
![](/public/Img/graphql.png)