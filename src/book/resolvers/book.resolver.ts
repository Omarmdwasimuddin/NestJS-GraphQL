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
    async updateBook(@Args('input') input: UpdateBookInput) {
        return this.bookService.update(input);
    }

    @Mutation(() => Boolean)
    async deleteBook(@Args('id', { type: () => String }) id: string) {
        return this.bookService.delete(id);
    }

}