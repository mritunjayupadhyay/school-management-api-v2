import { ProgrammeSubjectEntity } from "src/modules/programme/entity/programme_subject.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { BookEntity } from "./book.entity";

@Entity('subject')
export class SubjectEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @PrimaryColumn({ unique: true })
    name: string;

    @Column({ default: '', nullable: true })
    desc: string;

    @OneToMany(() => BookEntity, book => book.subject)
    books: BookEntity[];

    @ManyToOne(() => ProgrammeSubjectEntity, programme_subject => programme_subject.subject)
    programme_subjects: ProgrammeSubjectEntity[]
}