import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { validate } from "class-validator";
import { Repository } from "typeorm";
import { CreateBookDto } from "./dto/create.book.dto";
import { CreateTopicDto } from "./dto/create.topic.dto";
import { BookEntity } from "./entity/book.entity";
import { TopicEntity } from "./entity/topic.entity";
import { ModuleService } from "./module.service";
import { SubjectService } from "./subject.service";

@Injectable()
export class TopicService {
    constructor(
        @InjectRepository(TopicEntity)
        private readonly topicRepository: Repository<TopicEntity>,
        private readonly subjectService: SubjectService,
        private readonly moduleService: ModuleService
    ) {}

    async getTopics() 
    : Promise<{error: boolean, message?: string, status?: number, data?: TopicEntity[]}> {
        const data = await this.topicRepository.find();
        return { error: false, data }
    }
    async createTopic(createTopicDto: CreateTopicDto)
    : Promise<{error: boolean, message?: string, status?: number, data?: TopicEntity}> {
        const { topicName, moduleName, description } = createTopicDto;

        // Check if Topic is Already Exist
        const topicData = await this.getTopic(topicName);
        if (topicData.data) {
            return { 
                error: true, 
                message: `${topicName} already in use.`,
                status: HttpStatus.CONFLICT
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

        const topic = new TopicEntity();
        topic.name = topicName;
        topic.desc = description;
        topic.module = moduleData.data;
        const errors = await validate(topic);
        if (errors.length > 0) {
            const _errors = {};
            return {
                error: true,
                status: HttpStatus.BAD_REQUEST,
                message: 'Input data validation failed' + _errors
            }
        } 
        const savedBook = await this.topicRepository.save(topic);
        return {error: false, data: savedBook};
    }
    async getTopic(topicName: string) 
    : Promise<{error: boolean, message?: string, status?: number, data?: TopicEntity}> {
        if (!topicName) {
            return { error: true, status: HttpStatus.BAD_REQUEST, message: 'Book name is not given'};
        }
        const topic = await this.topicRepository.findOne({ name: topicName });
        if (topic) {
            return { error: false, data: topic };
        }
        return { error: true, status: HttpStatus.NOT_FOUND, message: 'Topic not found'};
    }

    async deleteTopic(topicName: string) 
    : Promise<{error: boolean, message?: string, status?: number, data?: any}> {
        // Check if subject Exist
        const subjectData = await this.getTopic(topicName);
        if (subjectData.error === true) {
            return subjectData;
        }
        const deletedSubject = await this.topicRepository.delete({ name: topicName });
        return { error: false, data: deletedSubject };
    }
}