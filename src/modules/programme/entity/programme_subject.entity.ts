import { SubjectEntity } from "src/modules/subject/entity/subject.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { ProgrammeEntity } from "./programme.entity";
import { ProgrammeRecommendedBookEntity } from "./programme_recommended_book.entity";

@Entity('programme_subject')
export class ProgrammeSubjectEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => SubjectEntity, subject => subject.programme_subjects)
    subject: SubjectEntity;

    @ManyToOne(() => ProgrammeEntity, programme => programme.programme_subjects)
    programme: ProgrammeEntity;

    @OneToMany(() => ProgrammeRecommendedBookEntity, recommended_book => recommended_book.programme_subject)
    recommended_books: ProgrammeRecommendedBookEntity[];
}