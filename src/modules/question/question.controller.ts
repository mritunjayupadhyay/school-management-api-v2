import { Body, Controller, Delete, Get, HttpException, Param, Post, Query, UseGuards } from "@nestjs/common";
import { ApiHeader, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "src/decorators/current_user.decorator";
import { AuthGuard } from "src/guards/auth.guard";
import { QuestionContributorGuard } from "src/guards/questionContributor.guard";
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
    async getQuestions() {
        const { error, data, message, status} = await this.questionService.getQuestions();
        if (error === true) {
                throw new HttpException({
                    message
                }, status)
        }
        return { error, data };
    }

    @ApiHeader({
        name:'token',
        description: 'Authentication header',
    })
    @Post('/')
    @UseGuards(QuestionContributorGuard)
    async createModule(
        @Body() createQuestionDto: CreateQuestionDto,
        @CurrentUser() currentUser: any
    ) {
        const { error, data, message, status} = await this.questionService.createQuestion(createQuestionDto, currentUser);
        if (error === true) {
                throw new HttpException({
                    message
                }, status)
        }
        return { error: false, data };
    }


    @Get('/getQuestion')
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