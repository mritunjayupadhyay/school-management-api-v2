import { IsBoolean, IsEmail } from "class-validator";
import * as bcrypt from 'bcrypt';
import { BeforeInsert, Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserRoleEntity } from "./user.role.entity";
import { AddressEntity } from "../address/address.entity";
import { InstitutionEntity } from "../institution/institution.entity";
import { InstitutionRoleEntity } from "../institution/institution.role.entity";
import { StudentClassEntity } from "../student_class/student_class.entity";
import { ProgrammeEntity } from "../programme/entity/programme.entity";
import { UserProgrammeBookEntity } from "../programme/entity/user_programme_book.entity";
import { UserPrimaryAddressEntity } from "../address/user_primary_address.entity";
import { StudentClassUserEntity } from "../student_class/student_class_user.entity";
import { InstitutionUserEntity } from "../institution/institute.user.entity";
import { QuestionMCQEntity } from "../question/questionMCQ.entity";

export enum Gender {
  MALE = "male",
  FEMALE = "female",
  OTHERS = 'others'
}

@Entity('user')
export class UserEntity {

  @CreateDateColumn()
  createdOn: Date;

  @UpdateDateColumn()
  updatedOn: Date; 

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({
    type: "enum",
    enum: Gender,
    default: Gender.MALE
  })
  gender: Gender

  @Column({ nullable: true })
  profilePic: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column({ default: false, nullable: true })
  isEmailVerified: boolean;

  @Column()
  mobile: string;

  @Column({ default: false, nullable: true })
  isMobileVerified: boolean;

  @Column()
  password: string;

  @Column({ default: true })
  active: boolean;

  @BeforeInsert()
  async hashPassword() {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt)
  }

  @ManyToMany(type => UserRoleEntity, role => role.users, {
    eager: true,
  })
  @JoinTable()
  roles: UserRoleEntity[];

  @OneToMany(() => AddressEntity, address => address.user)
  addresses: AddressEntity[];

  @OneToMany(() => InstitutionUserEntity, institutionUser => institutionUser.user)
  institutionUser: InstitutionUserEntity[];

  @ManyToOne(() => StudentClassUserEntity, studentClass => studentClass.user, {
    eager: true,
  })
  student_class_user: StudentClassUserEntity;

  @OneToMany(() => UserProgrammeBookEntity, user_programme_book => user_programme_book.user)
  user_programme_books: UserProgrammeBookEntity[]

  @OneToMany(() => QuestionMCQEntity, mcq_question => mcq_question.createdBy)
  created_mcq_questions: QuestionMCQEntity[]

  @ManyToMany(type => ProgrammeEntity, programme => programme.users, {
    eager: true,
  })
  @JoinTable()
  programmes: ProgrammeEntity[];

  @JoinColumn()
  @OneToOne(() => UserPrimaryAddressEntity, u_p_address => u_p_address.user)
  user_primary_address: UserPrimaryAddressEntity

//   @ManyToMany(type => ArticleEntity)
//   @JoinTable()
//   favorites: ArticleEntity[];

}