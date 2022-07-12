import { BookEntity } from "src/modules/subject/entity/book.entity";
import { SubjectEntity } from "src/modules/subject/entity/subject.entity";
import { Column, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { ProgrammeEntity } from "./programme.entity";
import { ProgrammeSubjectEntity } from "./programme_subject.entity";

@Entity('programme_recommended_book')
export class ProgrammeRecommendedBookEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => BookEntity, book => book.programme_recommended_books)
    book: BookEntity;

    @ManyToOne(() => ProgrammeSubjectEntity, programme_subject => programme_subject.recommended_books)
    programme_subject: ProgrammeSubjectEntity;
}