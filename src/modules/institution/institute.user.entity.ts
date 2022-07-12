import { IsString } from "class-validator";
import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserEntity } from "../user/user.entity";
import { InstitutionEntity } from "./institution.entity";
import { InstitutionRoleEntity } from "./institution.role.entity";

@Entity('institution_user')
export class InstitutionUserEntity {

    @CreateDateColumn()
    createdOn: Date;
  
    @UpdateDateColumn()
    updatedOn: Date;

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => UserEntity, user => user.institutionUser)
    user: UserEntity;

    @ManyToOne(() => InstitutionEntity, institution => institution.roles)
    institution: InstitutionEntity;

    @ManyToOne(() => InstitutionRoleEntity, institutionRole => institutionRole.users)
    institution_role: InstitutionRoleEntity;
}