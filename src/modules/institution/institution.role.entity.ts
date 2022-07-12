import { IsString } from "class-validator";
import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserEntity } from "../user/user.entity";
import { InstitutionUserEntity } from "./institute.user.entity";
import { InstitutionEntity } from "./institution.entity";

@Entity('institution_role')
export class InstitutionRoleEntity {

    @CreateDateColumn()
    createdOn: Date;
  
    @UpdateDateColumn()
    updatedOn: Date;

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    @IsString()
    name: string;

    @ManyToOne(() => InstitutionEntity, institution => institution.roles)
    institution: InstitutionEntity;

    @OneToMany(() => InstitutionUserEntity, user => user.institution_role)
    users: InstitutionUserEntity[];
}