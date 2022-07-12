import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ModuleService } from "../subject/module.service";
import { SubjectService } from "../subject/subject.service";
import { TopicService } from "../subject/topic.service";
import { QuestionMCQEntity } from "./questionMCQ.entity";

@Injectable()
export class QuestionService {
    constructor(
        @InjectRepository(QuestionMCQEntity)
        private readonly mcqQuestionRepository: Repository<QuestionMCQEntity>,
        private readonly subjectService: SubjectService,
        private readonly moduleService: ModuleService,
        private readonly topicService: TopicService
    ) {}
}