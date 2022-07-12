import { Column, CreateDateColumn, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ProgrammeEntity } from "../programme/entity/programme.entity";
import { StudentClassEntity } from "../student_class/student_class.entity";
import { UserEntity } from "../user/user.entity";
import { InstitutionRoleEntity } from "./institution.role.entity";

export enum InstitutionLabel {
    SCHOOL = "school",
    COACHING = "coaching"
}

@Entity('institution')
export class InstitutionEntity {

    @CreateDateColumn()
    createdOn: Date;
  
    @UpdateDateColumn()
    updatedOn: Date;

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    @Column({
        type: "enum",
        enum: InstitutionLabel
    })
    label: InstitutionLabel

    @OneToMany(() => InstitutionRoleEntity, role => role.institution)
    roles: InstitutionRoleEntity[];

    @OneToMany(() => StudentClassEntity, studentClass => studentClass.institution)
    student_classes: StudentClassEntity[];

    @OneToMany(() => ProgrammeEntity, programme => programme.institution)
    programmes: ProgrammeEntity[]
}