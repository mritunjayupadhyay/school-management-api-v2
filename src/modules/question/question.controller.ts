import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { QuestionService } from "./question.service";

@ApiTags('Question')
@Controller('question')
export class QuestionController {
    constructor(
        private readonly questionService: QuestionService
    ) {}

    @Get('/')
    async getModule() {
        
        return { error: false, data: {} };
    }
}