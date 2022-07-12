import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { InstitutionEntity } from "../institution/institution.entity";
import { ProgrammeEntity } from "../programme/entity/programme.entity";
import { StudentClassUserEntity } from "./student_class_user.entity";

// It is to denote in which class student are studying

@Entity('student_class')
export class StudentClassEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    @ManyToOne(() => InstitutionEntity, institution => institution.student_classes)
    institution: InstitutionEntity;

    @OneToMany(type => ProgrammeEntity, programme => programme.student_class)
    programmes: ProgrammeEntity[]

    @OneToMany(type => StudentClassUserEntity, student_class_entity => student_class_entity.studentClass)
    student_class_users: StudentClassUserEntity[]
}