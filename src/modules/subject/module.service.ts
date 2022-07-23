import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { validate } from "class-validator";
import { Repository } from "typeorm";
import { CreateBookDto } from "./dto/create.book.dto";
import { CreateModuleDto } from "./dto/create.module.dto";
import { BookEntity } from "./entity/book.entity";
import { ModuleEntity } from "./entity/module.entity";
import { SubjectService } from "./subject.service";

@Injectable()
export class ModuleService {
    constructor(
        @InjectRepository(ModuleEntity)
        private readonly moduleRepository: Repository<ModuleEntity>,
        private readonly subjectService: SubjectService
    ) {}

    async getModules() 
    : Promise<{error: boolean, message?: string, status?: number, data?: ModuleEntity[]}> {
        const data = await this.moduleRepository.find();
        return { error: false, data }
    }
    async createModule(createModuleDto: CreateModuleDto)
    : Promise<{error: boolean, message?: string, status?: number, data?: ModuleEntity}> {
        const { moduleName, subjectName, description } = createModuleDto;

        // Check if module Exist
        const moduleData = await this.getModule(moduleName);
        if (moduleData.data) {
            return { 
                error: true, 
                message: `${moduleName} already in use.`,
                status: HttpStatus.CONFLICT
            };
        }

        
        

        const module = new ModuleEntity();
        module.name = moduleName;
        module.desc = description;
        
        if (subjectName) { // If subject is given, it should be correct one.
            const subjectData = await this.subjectService.getSubject(subjectName);
            if (subjectData.error === true) {
                return { 
                    error: true, 
                    message: `${subjectName} is not found.`,
                    status: HttpStatus.BAD_REQUEST
                };
            } 
            module.subject = subjectData.data;
        }
        const errors = await validate(module);
        if (errors.length > 0) {
            const _errors = {};
            return {
                error: true,
                status: HttpStatus.BAD_REQUEST,
                message: 'Input data validation failed' + _errors
            }
        } 
        const savedBook = await this.moduleRepository.save(module);
        return {error: false, data: savedBook};
    }
    async getModule(moduleName: string) 
    : Promise<{error: boolean, message?: string, status?: number, data?: ModuleEntity}> {
        if (!moduleName) {
            return { error: true, status: HttpStatus.BAD_REQUEST, message: 'Book name is not given'};
        }
        const module = await this.moduleRepository.findOne({ name: moduleName });
        if (module) {
            return { error: false, data: module };
        }
        return { error: true, status: HttpStatus.NOT_FOUND, message: 'Module not found'};
    }

    async deleteModule(moduleName: string) 
    : Promise<{error: boolean, message?: string, status?: number, data?: any}> {
        // Check if subject Exist
        const subjectData = await this.getModule(moduleName);
        if (subjectData.error === true) {
            return subjectData;
        }
        const deletedSubject = await this.moduleRepository.delete({ name: moduleName });
        return { error: false, data: deletedSubject };
    }
}