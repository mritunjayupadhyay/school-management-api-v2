import { Body, Controller, Delete, Get, HttpException, Param, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { BookService } from "./book.service";
import { CreateBookDto } from "./dto/create.book.dto";
import { CreateTopicDto } from "./dto/create.topic.dto";
import { GetBookDto } from "./dto/get.book.dto";
import { GetTopicDto } from "./dto/get.topic.dto";
import { SubjectService } from "./subject.service";
import { TopicService } from "./topic.service";

@ApiTags('Topic')
@Controller('topics')
export class TopicController {
    constructor(
        private readonly topicService: TopicService
    ) {}

    @Get('/')
    async getSubjects() {
        const { error, data, message, status} = await this.topicService.getTopics();
        if (error === true) {
                throw new HttpException({
                    message
                }, status)
        }
        return { error, data };
    }

    @Post('/')
    async createSubject(
        @Body() createTopicDto: CreateTopicDto
    ) {
        const { error, data, message, status} = await this.topicService.createTopic(createTopicDto);
        if (error === true) {
                throw new HttpException({
                    message
                }, status)
        }
        return { error, data };
    }

    @Get('/:bookName')
    async getSubject(
        @Param() getTopicDto: GetTopicDto
    ) {
        const { topicName } = getTopicDto;
        const { error, data, message, status} = await this.topicService.getTopic(topicName);
        if (error === true) {
                throw new HttpException({
                    message
                }, status)
        }
        return { error, data };
    }

    @Delete('/:bookName')
    async deleteSubject(
        @Param() getTopicDto: GetTopicDto
    ) {
        const { topicName } = getTopicDto;
        return this.topicService.deleteTopic(topicName);
    }
}