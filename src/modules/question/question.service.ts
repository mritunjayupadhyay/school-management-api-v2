import { HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { getRepository, Repository } from "typeorm";
import { ModuleService } from "../subject/module.service";
import { SubjectService } from "../subject/subject.service";
import { TopicService } from "../subject/topic.service";
import { CreateQuestionDto } from "./dto/create.question.dto";
import { GetQuestionDto } from "./dto/get.question.dto";
import { QuestionMCQEntity } from "./questionMCQ.entity";

@Injectable()
export class QuestionService {
    constructor(
        @InjectRepository(QuestionMCQEntity)
        private readonly mcqQuestionRepository: Repository<QuestionMCQEntity>,
        private readonly subjectService: SubjectService,
        private readonly moduleService: ModuleService,
        private readonly topicService: TopicService,
        private configService: ConfigService
    ) {}

    async getQuestions() 
    : Promise<{error: boolean, message?: string, status?: number, data?: QuestionMCQEntity[]}> {
        const data = await this.mcqQuestionRepository.find();
        return { error: false, data }
    }
    // async createQuestion( createQuestionDto: CreateQuestionDto)
    // : Promise<{error: boolean, message?: string, status?: number, data?: QuestionMCQEntity}> {
    //     const { topicName, moduleName, description } = createTopicDto;

    //     // Check if Topic is Already Exist
    //     const topicData = await this.getTopic(topicName);
    //     if (topicData.data) {
    //         return { 
    //             error: true, 
    //             message: `${topicName} already in use.`,
    //             status: HttpStatus.BAD_REQUEST
    //         };
    //     }

    //     // Check if module Exist
    //     const moduleData = await this.moduleService.getModule(moduleName);
    //     if (moduleData.error === true) {
    //         return { 
    //             error: true, 
    //             message: `${moduleName} is not found.`,
    //             status: HttpStatus.BAD_REQUEST
    //         };
    //     }       

    //     const topic = new TopicEntity();
    //     topic.name = topicName;
    //     topic.desc = description;
    //     topic.module = moduleData.data;
    //     const errors = await validate(topic);
    //     if (errors.length > 0) {
    //         const _errors = {};
    //         return {
    //             error: true,
    //             status: HttpStatus.BAD_REQUEST,
    //             message: 'Input data validation failed' + _errors
    //         }
    //     } 
    //     const savedBook = await this.mcqQuestionRepository.save(topic);
    //     return {error: false, data: savedBook};
    // }
    async getQuestion(getQuestionDto: GetQuestionDto) 
    : Promise<{error: boolean, message?: string, status?: number, data?: QuestionMCQEntity[]}> {
        const { topicName, moduleName, subjectName, questionText } = getQuestionDto;
        if (!topicName) {
            return { error: true, status: HttpStatus.BAD_REQUEST, message: `Topic name ${topicName} is not given`};
        }
        if (!moduleName) {
            return { error: true, status: HttpStatus.BAD_REQUEST, message: `Module name ${moduleName} is not given`};
        }
        if (!subjectName) {
            return { error: true, status: HttpStatus.BAD_REQUEST, message: `Subject name ${subjectName} is not given`};
        }
        if (!questionText) {
            return { error: true, status: HttpStatus.BAD_REQUEST, message: `Question is not given`};
        }
        const qb = getRepository(QuestionMCQEntity, this.configService.get('DB_NAME'))
        .createQueryBuilder("mcq_question")
        .leftJoin("mcq_question.subject", "subject")
        .leftJoin("mcq_question.module", "module")
        .leftJoin("mcq_question.topic", "topic")
        .where("subject.name = :subjectName", { subjectName })
        .andWhere("module.name = :moduleName", { moduleName })
        .andWhere("topic.name = :topicName", { topicName });

        const questions = await qb.getMany();        
        if (questions) {
            return { error: false, data: questions };
        }
        return { error: true, status: HttpStatus.NOT_FOUND, message: 'Topic not found'};
    }

    // async deleteQuestion(getQuestionDto: GetQuestionDto) 
    // : Promise<{error: boolean, message?: string, status?: number, data?: any}> {
    //     // Check if subject Exist
    //     const subjectData = await this.getTopic(topicName);
    //     if (subjectData.error === true) {
    //         return subjectData;
    //     }
    //     const deletedSubject = await this.mcqQuestionRepository.delete({ name: topicName });
    //     return { error: false, data: deletedSubject };
    // }
}