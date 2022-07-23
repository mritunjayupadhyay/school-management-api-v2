import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { validate } from "class-validator";
import { Repository } from "typeorm";
import { CreateSubjectDto } from "./dto/create.subject.dto";
import { SubjectEntity } from "./entity/subject.entity";

@Injectable()
export class SubjectService {
    constructor(
        @InjectRepository(SubjectEntity)
        private readonly subjectRepository: Repository<SubjectEntity>,
    ) {}

    async getSubjects() 
    : Promise<{error: boolean, message?: string, status?: number, data?: SubjectEntity[]}> {
        const data = await this.subjectRepository.find();
        return { error: false, data }
    }
    async createSubject(createSubjectDto: CreateSubjectDto)
    : Promise<{error: boolean, message?: string, status?: number, data?: SubjectEntity}> {
        const { subjectName, description } = createSubjectDto;

        // Check if subject Exist
        const subjectData = await this.getSubject(subjectName);
        if (subjectData.data) {
            return { 
                error: true, 
                message: `${subjectName} already in use.`,
                status: HttpStatus.CONFLICT
            };
        }

        const subject = new SubjectEntity();
        subject.name = subjectName;
        subject.desc = description;
        const errors = await validate(subject);
        if (errors.length > 0) {
            const _errors = {};
            return {
                error: true,
                status: HttpStatus.BAD_REQUEST,
                message: 'Input data validation failed' + _errors
            }
        } 
        const savedSubject = await this.subjectRepository.save(subject);
        return {error: false, data: savedSubject};
    }
    async getSubject(subjectName: string) 
    : Promise<{error: boolean, message?: string, status?: number, data?: SubjectEntity}> {
        if (!subjectName) {
            return { error: true, status: HttpStatus.BAD_REQUEST, message: 'Subject name is not given'};
        }
        const subject = await this.subjectRepository.findOne({ name: subjectName });
        if (subject) {
            return { error: false, data: subject };
        }
        return { error: true, status: HttpStatus.NOT_FOUND, message: 'Subject not found'};
    }

    async deleteSubject(subjectName: string) 
    : Promise<{error: boolean, message?: string, status?: number, data?: any}> {
        // Check if subject Exist
        const subjectData = await this.getSubject(subjectName);
        if (subjectData.error === true) {
            return subjectData;
        }
        const deletedSubject = await this.subjectRepository.delete({ name: subjectName });
        return { error: false, data: deletedSubject };
    }
}