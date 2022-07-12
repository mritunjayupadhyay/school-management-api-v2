import { BookEntity } from "src/modules/subject/entity/book.entity";
import { UserEntity } from "src/modules/user/user.entity";
import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ProgrammeEntity } from "./programme.entity";

@Entity('user_programme_book') // This is not complete
export class UserProgrammeBookEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => UserEntity, user => user.user_programme_books)
    user: UserEntity;

    @ManyToOne(() => ProgrammeEntity, programme => programme.user_programme_books)
    programme: ProgrammeEntity;

    @ManyToOne(() => BookEntity, book => book.user_programme_books)
    book: BookEntity;
}