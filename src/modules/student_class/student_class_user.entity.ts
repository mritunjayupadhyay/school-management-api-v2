import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { InstitutionEntity } from "../institution/institution.entity";
import { ProgrammeEntity } from "../programme/entity/programme.entity";
import { UserEntity } from "../user/user.entity";
import { StudentClassEntity } from "./student_class.entity";

export enum StudentClassStatus {
    PURSUING = "pursuing",
    COMPLETED = "completed",
    FAILED = "failed"
}

// This serve a relation between student and student class

@Entity('student_class_user')
export class StudentClassUserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: "enum",
        enum: StudentClassStatus,
        default: StudentClassStatus.PURSUING
    })
    label: StudentClassStatus

    @Column({ default: true })
    active: boolean;

    @OneToOne(type => UserEntity, user => user.student_class_user)
    user: UserEntity;

    @ManyToOne(() => StudentClassEntity, studentClass => studentClass.student_class_users)
    studentClass: StudentClassEntity;

}