import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { validate } from "class-validator";
import { Repository } from "typeorm";
import { CreateBookDto } from "./dto/create.book.dto";
import { BookEntity } from "./entity/book.entity";
import { SubjectService } from "./subject.service";

@Injectable()
export class BookService {
    constructor(
        @InjectRepository(BookEntity)
        private readonly bookRepository: Repository<BookEntity>,
        private readonly subjectService: SubjectService
    ) {}

    async getBooks() 
    : Promise<{error: boolean, message?: string, status?: number, data?: BookEntity[]}> {
        const data = await this.bookRepository.find();
        return { error: false, data }
    }
    async createBook(createBookDto: CreateBookDto)
    : Promise<{error: boolean, message?: string, status?: number, data?: BookEntity}> {
        const { bookName, subjectName, description, authors, publication, price, selling_price } = createBookDto;

        // Check if book Exist
        const bookData = await this.getBook(bookName);
        if (bookData.data) {
            return { 
                error: true, 
                message: `${bookName} already in use.`,
                status: HttpStatus.CONFLICT
            };
        }

        const book = new BookEntity();
        book.name = bookName;
        book.desc = description;
        book.price = price;
        book.selling_price = selling_price;
        book.publication = publication;
        book.authors = authors;
        if (subjectName) { // If subject is given, it should be correct one.
            const subjectData = await this.subjectService.getSubject(subjectName);
            if (subjectData.error === true) {
                return { 
                    error: true, 
                    message: `${subjectName} is not found.`,
                    status: HttpStatus.BAD_REQUEST
                };
            } 
            book.subject = subjectData.data;
        }
        const errors = await validate(book);
        if (errors.length > 0) {
            const _errors = {};
            return {
                error: true,
                status: HttpStatus.BAD_REQUEST,
                message: 'Input data validation failed' + _errors
            }
        } 
        const savedBook = await this.bookRepository.save(book);
        return {error: false, data: savedBook};
    }
    async getBook(bookName: string) 
    : Promise<{error: boolean, message?: string, status?: number, data?: BookEntity}> {
        if (!bookName) {
            return { error: true, status: HttpStatus.BAD_REQUEST, message: 'Book name is not given'};
        }
        const subject = await this.bookRepository.findOne({ name: bookName });
        if (subject) {
            return { error: false, data: subject };
        }
        return { error: true, status: HttpStatus.NOT_FOUND, message: 'Book not found'};
    }

    async deleteBook(bookName: string) 
    : Promise<{error: boolean, message?: string, status?: number, data?: any}> {
        // Check if subject Exist
        const subjectData = await this.getBook(bookName);
        if (subjectData.error === true) {
            return subjectData;
        }
        const deletedSubject = await this.bookRepository.delete({ name: bookName });
        return { error: false, data: deletedSubject };
    }
}