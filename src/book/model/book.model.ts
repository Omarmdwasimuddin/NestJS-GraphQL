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