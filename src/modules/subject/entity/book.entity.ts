import { ProgrammeRecommendedBookEntity } from "src/modules/programme/entity/programme_recommended_book.entity";
import { UserProgrammeBookEntity } from "src/modules/programme/entity/user_programme_book.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { SubjectEntity } from "./subject.entity";

@Entity('book')
export class BookEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @PrimaryColumn({ unique: true })
    name: string;

    @Column({ default: '', nullable: true })
    desc: string;

    @Column("simple-array")
    authors: string[];

    @Column()
    publication: string;

    @Column()
    price: number;

    @Column()
    selling_price: number;

    @ManyToOne(() => SubjectEntity, subject => subject.books)
    subject: SubjectEntity;

    @OneToMany(() => ProgrammeRecommendedBookEntity, recommended_book => recommended_book.book)
    programme_recommended_books: ProgrammeRecommendedBookEntity[];

    @OneToMany(() => UserProgrammeBookEntity, user_programme_book => user_programme_book.book)
    user_programme_books: UserProgrammeBookEntity[]
}