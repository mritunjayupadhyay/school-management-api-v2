import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { StudentClassModule } from "../student_class/student_class.module";
import { UserModule } from "../user/user.module";
import { InstitutionUserEntity } from "./institute.user.entity";
import { InstitutionController } from "./institution.controller";
import { InstitutionEntity } from "./institution.entity";
import { InstitutionRoleEntity } from "./institution.role.entity";
import { InstitutionService } from "./institution.service";
import { InstitutionUserService } from "./institution.user.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            InstitutionEntity,
            InstitutionRoleEntity,
            InstitutionUserEntity
        ]),
        UserModule,
        StudentClassModule
    ],
    controllers: [InstitutionController],
    providers: [InstitutionService, InstitutionUserService]
})
export class InstitutionModule {}