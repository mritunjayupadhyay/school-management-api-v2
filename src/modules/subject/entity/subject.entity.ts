import { ProgrammeSubjectEntity } from "src/modules/programme/entity/programme_subject.entity";
import { QuestionMCQEntity } from "src/modules/question/questionMCQ.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { BookEntity } from "./book.entity";
import { ModuleEntity } from "./module.entity";

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

    @OneToMany(() => ModuleEntity, module => module.subject)
    modules: ModuleEntity[];

    @OneToMany(() => QuestionMCQEntity, mcq_question => mcq_question.subject)
    mcq_questions: QuestionMCQEntity[];

    @OneToMany(() => ProgrammeSubjectEntity, programme_subject => programme_subject.subject)
    programme_subjects: ProgrammeSubjectEntity[]
}