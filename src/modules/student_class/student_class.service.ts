import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { validate } from "class-validator";
import { Repository } from "typeorm";
import { UserService } from "../user/user.service";
import { AddUserToStudentClassDto } from "./dto/add_user.student_class.dto";
import { CreateStudentClassDto } from "./dto/create.student_class.dto";
import { GetStudentDto } from "./dto/get.student_class.dto";
import { StudentClassEntity } from "./student_class.entity";
import { StudentClassStatus, StudentClassUserEntity } from "./student_class_user.entity";

@Injectable()
export class StudentClassService {
    constructor(
        @InjectRepository(StudentClassEntity)
        private readonly studentClassRepository: Repository<StudentClassEntity>,
        @InjectRepository(StudentClassUserEntity)
        private readonly studentClassUserRepository: Repository<StudentClassUserEntity>,
        private readonly userService: UserService,

    ) {}

    async getStudentClasses() {
        return this.studentClassRepository.find();
    }

    async getStudentClassByName(name: string) {
        const studentClass = await this.studentClassRepository.findOne({ name });
        if (studentClass) {
            return { error: false, data: studentClass };
        }
        return { error: true, status: HttpStatus.NOT_FOUND, message: `Student Class with name ${name} not found`};
    }

    async createStudentClass(createStudentClassDto: CreateStudentClassDto)
    : Promise<{error: boolean, message?: string, status?: number, data?: StudentClassEntity}> {
        const { name } = createStudentClassDto;
        const studentClass = new StudentClassEntity();
        studentClass.name = name;

        const errors = await validate(studentClass);
        if (errors.length > 0) {
            const _errors = {username: 'Userinput is not valid.'};
            return {
                error: true,
                status: HttpStatus.BAD_REQUEST,
                message: 'Input data validation failed' + _errors
            }
        } 
        const savedStudentClass = await this.studentClassRepository.save(studentClass);
        return {error: false, data: savedStudentClass};
    }

    async getStudentClass(name: string, isAllInfoRequired?: boolean) 
    : Promise<{error: boolean, message?: string, status?: number, data?: StudentClassEntity}> { 
        if (!name) {
            return {
                error: true,
                message: 'name is empty',
                status: HttpStatus.BAD_REQUEST
            }
        }
        const studentClass = isAllInfoRequired ? 
                            await this.studentClassRepository.findOne({ name }, { relations: ['users']})
                            : await this.studentClassRepository.findOne({ name });
        if (!!studentClass) {
            return { error: false, data: studentClass };
        }
        console.log("the studentClass we ahve", studentClass)
        return { error: true, status: HttpStatus.NOT_FOUND, message: 'studentClass not found'};
    }

    async deleteStudentClass(getStudentDto: GetStudentDto) 
    : Promise<{error: boolean, message?: string, status?: number, data?: any}> {
        const { name } = getStudentDto;
        const getInstitutionData = await this.getStudentClass(name, false);
        if (getInstitutionData.error === true) {
            return getInstitutionData;
        }
        const deletedInstRole = await this.studentClassRepository.delete({ name });
        return { error: false, data: deletedInstRole };
    }

    async addUser(addUserToStudentClassDto: AddUserToStudentClassDto)
    : Promise<{error: boolean, message?: string, status?: number, data?: any}> {
        const { userId, studentClassName } = addUserToStudentClassDto;

        const id = typeof userId === 'string' ? Number(userId) : userId;
        const userData = await this.userService.getUserById(id);
        if (userData.error) {
            return userData;
        }
        const user = userData.data;

        const studentClassData = await this.getStudentClassByName(studentClassName);
        if (studentClassData.error) {
            return studentClassData;
        }
        const studentClass = studentClassData.data;

        // create new institution user
        let newStudentClassUser = new StudentClassUserEntity();
        newStudentClassUser.label = StudentClassStatus.PURSUING;
        newStudentClassUser.user = user;
        newStudentClassUser.studentClass = studentClass;

        const errors = await validate(newStudentClassUser);
        if (errors.length > 0) {
            return { 
                error: true, 
                message: errors.join(""),
                status: HttpStatus.BAD_REQUEST
            };
        } 
        const createdNewStudentClassUser = await this.studentClassUserRepository.save(newStudentClassUser);
        return {error: false, data: createdNewStudentClassUser };
    }

    async getUser()
    : Promise<{error: boolean, message?: string, status?: number, data?: any}> {
        const users = await this.studentClassUserRepository.find();
        return {error: false, data: users };
    }
}