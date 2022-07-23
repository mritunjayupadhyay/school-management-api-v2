import { HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { validate } from "class-validator";
import { getRepository, Repository } from "typeorm";
import { ModuleService } from "../subject/module.service";
import { SubjectService } from "../subject/subject.service";
import { TopicService } from "../subject/topic.service";
import { UserEntity } from "../user/user.entity";
import { CreateQuestionDto } from "./dto/create.question.dto";
import { GetQuestionDto } from "./dto/get.question.dto";
import { QuestionMCQEntity, ViewType } from "./questionMCQ.entity";

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
    async createQuestion( createQuestionDto: CreateQuestionDto, currentUser: UserEntity)
    : Promise<{error: boolean, message?: string, status?: number, data?: QuestionMCQEntity}> {
        const { questionText, questionType, level,
        optionA, optionAValue, optionAType,
        optionB, optionBType, optionBValue,
        optionC, optionCType, optionCValue,
        optionD, optionDType, optionDValue,
        subjectName, topicName, moduleName } = createQuestionDto;

        // Check if Question is Already Exist
        const getQuestionDto: GetQuestionDto = {
            questionText,
            subjectName, topicName, moduleName
        }
        const questionData = await this.getQuestion(getQuestionDto);
        if (Array.isArray(questionData.data) && questionData.data.length) {
            return { 
                error: true, 
                message: `Already in use.`,
                status: HttpStatus.CONFLICT
            };
        }

        // Check if subject Exist
        const subjectData = await this.subjectService.getSubject(subjectName);
        if (subjectData.error === true) {
            return { 
                error: true, 
                message: `${subjectName} is not found.`,
                status: HttpStatus.BAD_REQUEST
            };
        } 

        // Check if module Exist
        const moduleData = await this.moduleService.getModule(moduleName);
        if (moduleData.error === true) {
            return { 
                error: true, 
                message: `${moduleName} is not found.`,
                status: HttpStatus.BAD_REQUEST
            };
        } 
        // Check if topic Exist
        const topicData = await this.topicService.getTopic(topicName);
        if (topicData.error === true) {
            return { 
                error: true, 
                message: `${topicName} is not found.`,
                status: HttpStatus.BAD_REQUEST
            };
        } 
              

        const mcqQuestion = new QuestionMCQEntity();
        mcqQuestion.questionText = questionText;
        mcqQuestion.questionType = ViewType[questionType];
        if (level) {
            mcqQuestion.level = level;
        }
        
        mcqQuestion.optionA = optionA;
        mcqQuestion.optionAType = ViewType[optionAType];
        mcqQuestion.optionAValue = optionAValue;

        mcqQuestion.optionB = optionB;
        mcqQuestion.optionBType = ViewType[optionBType];
        mcqQuestion.optionBValue = optionBValue;

        mcqQuestion.optionC = optionC;
        mcqQuestion.optionCType = ViewType[optionCType];
        mcqQuestion.optionCValue = optionCValue;

        mcqQuestion.optionD = optionD;
        mcqQuestion.optionDType = ViewType[optionDType];
        mcqQuestion.optionDValue = optionDValue;

        mcqQuestion.topic = topicData.data;
        mcqQuestion.module = moduleData.data;
        mcqQuestion.subject = subjectData.data;
        mcqQuestion.createdBy = currentUser;
        
        const errors = await validate(mcqQuestion);
        if (errors.length > 0) {
            const _errors = {};
            return {
                error: true,
                status: HttpStatus.BAD_REQUEST,
                message: 'Input data validation failed' + _errors
            }
        } 
        const savedQuestion = await this.mcqQuestionRepository.save(mcqQuestion);
        return {error: false, data: savedQuestion};
    }
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