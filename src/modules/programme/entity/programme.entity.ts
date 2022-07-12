import { InstitutionEntity } from "src/modules/institution/institution.entity";
import { StudentClassEntity } from "src/modules/student_class/student_class.entity";
import { UserEntity } from "src/modules/user/user.entity";
import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ProgrammeSubjectEntity } from "./programme_subject.entity";
import { UserProgrammeBookEntity } from "./user_programme_book.entity";

@Entity('programme')
export class ProgrammeEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    @ManyToMany(type => UserEntity, user => user.programmes)
    users: UserEntity[];

    @ManyToOne(() => InstitutionEntity, institution => institution.programmes)
    institution: InstitutionEntity;

    @ManyToOne(() => StudentClassEntity, studentClass => studentClass.programmes)
    student_class: StudentClassEntity;

    @OneToMany(() => ProgrammeSubjectEntity, programme_subject => programme_subject.programme)
    programme_subjects: ProgrammeSubjectEntity[]

    @OneToMany(() => UserProgrammeBookEntity, user_programme_book => user_programme_book.programme)
    user_programme_books: UserProgrammeBookEntity[]
}