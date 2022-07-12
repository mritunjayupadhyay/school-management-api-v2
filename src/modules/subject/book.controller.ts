import { Body, Controller, Delete, Get, HttpException, Param, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { BookService } from "./book.service";
import { CreateBookDto } from "./dto/create.book.dto";
import { GetBookDto } from "./dto/get.book.dto";
import { SubjectService } from "./subject.service";

@ApiTags('Book')
@Controller('book')
export class BookController {
    constructor(
        private readonly bookService: BookService
    ) {}

    @Get('/')
    async getSubjects() {
        const { error, data, message, status} = await this.bookService.getBooks();
        if (error === true) {
                throw new HttpException({
                    message
                }, status)
        }
        return { error, data };
    }

    @Post('/')
    async createSubject(
        @Body() createBookDto: CreateBookDto
    ) {
        const { error, data, message, status} = await this.bookService.createBook(createBookDto);
        if (error === true) {
                throw new HttpException({
                    message
                }, status)
        }
        return { error, data };
    }

    @Get('/:bookName')
    async getSubject(
        @Param() getBookDto: GetBookDto
    ) {
        const { bookName } = getBookDto;
        const { error, data, message, status} = await this.bookService.getBook(bookName);
        if (error === true) {
                throw new HttpException({
                    message
                }, status)
        }
        return { error, data };
    }

    @Delete('/:bookName')
    async deleteSubject(
        @Param() getBookDto: GetBookDto
    ) {
        const { bookName } = getBookDto;
        return this.bookService.deleteBook(bookName);
    }
}