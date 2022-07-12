import { Body, Controller, Delete, Get, HttpException, Param, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AddUserToStudentClassDto } from "./dto/add_user.student_class.dto";
import { CreateStudentClassDto, CreateStudentClassUserDto } from "./dto/create.student_class.dto";
import { GetStudentDto } from "./dto/get.student_class.dto";
import { StudentClassService } from "./student_class.service";

@ApiTags('StudentClass')
@Controller('student-class')
export class StudentClassController {
    constructor(
        private readonly studentClassService: StudentClassService
    ) {}

    @Get('/')
    async getStudentClass() {
        return this.studentClassService.getStudentClasses();
    }

    @Post('/')
    async createStudentClass(
        @Body() createStudentClassDto: CreateStudentClassDto
    ) {
        const { error, data, message, status} = await this.studentClassService.createStudentClass(createStudentClassDto);
        if (error === true) {
            throw new HttpException({
                message
            }, status)
        }
        return { error, data };
    }

    // @Post('/')
    // async createStudentClassUser(
    //     @Body() createStudentClassUserDto: CreateStudentClassUserDto
    // ) {
    //     const { error, data, message, status} = await this.studentClassService.createStudentClass(createStudentClassDto);
    //     if (error === true) {
    //         throw new HttpException({
    //             message
    //         }, status)
    //     }
    //     return { error, data };
    // }
    @Delete('/:name')
    async deleteStudentClass(
        @Param() getStudentDto: GetStudentDto
    ) {
        const { error, data, message, status} = await this.studentClassService.deleteStudentClass(getStudentDto);
        if (error === true) {
            throw new HttpException({
                message
            }, status)
        }
        return { error, data };
    }

    @Post('/add-user')
    async addUser(
        @Body() addUserToStudentClassDto: AddUserToStudentClassDto
    ) {
        const { error, data, message, status} = await this.studentClassService.addUser(addUserToStudentClassDto);
        if (error === true) {
            throw new HttpException({
                message
            }, status)
        }
        return { error, data };
    }

    @Get('/users')
    async getStudentClassUsers() {
        return this.studentClassService.getUser();
    }
}