import { Body, Controller, Delete, Get, HttpException, Param, Post, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CreateQuestionDto } from "./dto/create.question.dto";
import { GetQuestionDto } from "./dto/get.question.dto";
import { QuestionService } from "./question.service";

@ApiTags('Question')
@Controller('question')
export class QuestionController {
    constructor(
        private readonly questionService: QuestionService
    ) {}

    @Get('/')
    async getModule() {
        const { error, data, message, status} = await this.questionService.getQuestions();
        if (error === true) {
                throw new HttpException({
                    message
                }, status)
        }
        return { error, data };
    }

    // @Post('/')
    // async createModule(
    //     @Body() createQuestionDto: CreateQuestionDto
    // ) {
    //     const { error, data, message, status} = await this.questionService.createQuestion(createModuleDto);
    //     if (error === true) {
    //             throw new HttpException({
    //                 message
    //             }, status)
    //     }
    //     return { error, data };
    // }

    @Get('/get-question')
    async getSubject(
        @Query() getQuestionDto: GetQuestionDto
    ) {
        const { error, data, message, status} = await this.questionService.getQuestion(getQuestionDto);
        if (error === true) {
                throw new HttpException({
                    message
                }, status)
        }
        return { error, data };
    }

    // @Delete('/:moduleName')
    // async deleteSubject(
    //     @Param() getQuestionDto: GetQuestionDto
    // ) {
    //     return this.questionService.deleteModule(getQuestionDto);
    // }
}