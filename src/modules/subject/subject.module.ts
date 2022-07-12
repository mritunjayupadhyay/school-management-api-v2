import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "../user/user.module";
import { BookController } from "./book.controller";
import { BookService } from "./book.service";
import { BookEntity } from "./entity/book.entity";
import { ModuleEntity } from "./entity/module.entity";
import { SubjectEntity } from "./entity/subject.entity";
import { TopicEntity } from "./entity/topic.entity";
import { ModuleController } from "./module.controller";
import { ModuleService } from "./module.service";
import { SubjectController } from "./subject.controller";
import { SubjectService } from "./subject.service";
import { TopicController } from "./topic.controller";
import { TopicService } from "./topic.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            SubjectEntity, BookEntity, ModuleEntity, TopicEntity
        ])
    ],
    controllers: [SubjectController, BookController, ModuleController, TopicController],
    providers: [SubjectService, BookService, ModuleService, TopicService],
    exports: [SubjectService, BookService, ModuleService, TopicService]
})
export class SubjectModule {}