import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "../user/user.module";
import { StudentClassController } from "./student_class.controller";
import { StudentClassEntity } from "./student_class.entity";
import { StudentClassService } from "./student_class.service";
import { StudentClassUserEntity } from "./student_class_user.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([StudentClassEntity, StudentClassUserEntity]),
        UserModule
    ],
    controllers: [StudentClassController],
    providers: [StudentClassService],
    exports: [StudentClassService]
})
export class StudentClassModule {}