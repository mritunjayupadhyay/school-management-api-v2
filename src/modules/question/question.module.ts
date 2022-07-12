import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SubjectModule } from "../subject/subject.module";
import { UserModule } from "../user/user.module";
import { QuestionController } from "./question.controller";
import { QuestionService } from "./question.service";
import { QuestionMCQEntity } from "./questionMCQ.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([QuestionMCQEntity]),
        UserModule,
        SubjectModule
    ],
    controllers: [QuestionController],
    providers: [QuestionService],
    exports: [QuestionService]
})
export class QuestionModule {}