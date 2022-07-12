import { Body, Controller, Delete, Get, HttpException, Param, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CreateSubjectDto } from "./dto/create.subject.dto";
import { GetSubjectDto } from "./dto/get.subject.dto";
import { SubjectService } from "./subject.service";

@ApiTags('Subject')
@Controller('subject')
export class SubjectController {
    constructor(
        private readonly subjectService: SubjectService
    ) {}

    @Get('/')
    async getSubjects() {
        const { error, data, message, status} = await this.subjectService.getSubjects();
        if (error === true) {
                throw new HttpException({
                    message
                }, status)
        }
        return { error, data };
    }

    @Post('/')
    async createSubject(
        @Body() createSubjectDto: CreateSubjectDto
    ) {
        const { error, data, message, status} = await this.subjectService.createSubject(createSubjectDto);
        if (error === true) {
                throw new HttpException({
                    message
                }, status)
        }
        return { error, data };
    }

    @Get('/:subjectName')
    async getSubject(
        @Param() getSubjectDto: GetSubjectDto
    ) {
        const { subjectName } = getSubjectDto;
        const { error, data, message, status} = await this.subjectService.getSubject(subjectName);
        if (error === true) {
                throw new HttpException({
                    message
                }, status)
        }
        return { error, data };
    }

    @Delete('/:subjectName')
    async deleteSubject(
        @Param() getSubjectDto: GetSubjectDto
    ) {
        const { subjectName } = getSubjectDto;
        return this.subjectService.deleteSubject(subjectName);
    }

}