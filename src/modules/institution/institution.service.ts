import { HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { validate } from "class-validator";
import { getConnection, getManager, getRepository, Repository } from "typeorm";
import { UserService } from "../user/user.service";
import { GetInstitutionAndUserDto } from "./dto/user.institution.dto";
import { CreateInstitutionDto } from "./dto/create.institution.dto";
import { AddStudentClassToInstitutionDto, GetInstitutionDto } from "./dto/get.institution.dto";
import { InstitutionRoleDto } from "./dto/institution.role.dto";
import { InstitutionEntity, InstitutionLabel } from "./institution.entity";
import { InstitutionRoleEntity } from "./institution.role.entity";
import { StudentClassService } from "../student_class/student_class.service";
import { GetInstitutionQueryDto } from "./dto/get.institution.query.dto";

@Injectable()
export class InstitutionService {
    constructor(
        @InjectRepository(InstitutionEntity)
        private readonly institutionRepository: Repository<InstitutionEntity> ,
        @InjectRepository(InstitutionRoleEntity)
        private readonly institutionRoleRepository: Repository<InstitutionRoleEntity> ,
        private readonly userService: UserService,
        private configService: ConfigService,
        private readonly studentClassService: StudentClassService  
    ) {}

    async validateInstitution(createInstitutionDto: CreateInstitutionDto)
    : Promise<{error: boolean, message?: string, status?: number, newInstitution?: InstitutionEntity}> {
        const { name, label} = createInstitutionDto;
        
        if (!Object.values(InstitutionLabel).includes(label as InstitutionLabel)) {
            return { 
                error: true, 
                message: `${label} is not permitted as Label.`,
                status: HttpStatus.BAD_REQUEST
            };
        }

        // Check if institution Exist
        const institutionWithName = await this.getInstitutionByName(name);
        if (institutionWithName.data) {
            return { 
                error: true, 
                message: `${name} already in use.`,
                status: HttpStatus.BAD_REQUEST
            };
        }
        // create new institution
        let newInstitution = new InstitutionEntity();
        newInstitution.name = name;
        newInstitution.label = label as InstitutionLabel;

        const errors = await validate(newInstitution);
        if (errors.length > 0) {
            return { 
                error: true, 
                message: errors.join(""),
                status: HttpStatus.BAD_REQUEST
            };
        } else {
            return {error: false, newInstitution};
        }
    }

    async getInstitution(getInstitutionQueryDto: GetInstitutionQueryDto)
    : Promise<{error: boolean, message?: string, status?: number, data?: any}> {
        const { studentClass } = getInstitutionQueryDto;

        const qb = getRepository(InstitutionEntity, this.configService.get('DB_NAME'))
            .createQueryBuilder("institution")
            .leftJoin("institution.student_classes", "student_classes");
        
        if (studentClass) {
            qb.andWhere("student_classes.name = :studentClassName", { studentClassName: studentClass });
        }
        const institutions = await qb.getMany();
        return {error: false, data: institutions };
    }

    async getInstitutionByName(name: string, isAllInfoRequired?: boolean) 
    : Promise<{error: boolean, message?: string, status?: number, data?: InstitutionEntity}> { 
        if (!name) {
            return {
                error: true,
                message: 'name is empty',
                status: HttpStatus.BAD_REQUEST
            }
        }
        const institution = isAllInfoRequired ? 
                            await this.institutionRepository.findOne({ name }, { relations: ['student_classes']})
                            : await this.institutionRepository.findOne({ name });
        if (!!institution) {
            return { error: false, data: institution };
        }
        console.log("the institution we ahve", institution)
        return { error: true, status: HttpStatus.NOT_FOUND, message: 'institution not found'};
    }

    async deleteInstitutionWithName(getInstitutionDto: GetInstitutionDto) 
    : Promise<{error: boolean, message?: string, status?: number, data?: any}> {
        const { name } = getInstitutionDto;
        const getInstitutionData = await this.getInstitutionByName(name);
        if (getInstitutionData.error === true) {
            return getInstitutionData;
        }
        const deletedInstRole = await this.institutionRepository.delete({ name });
        return { error: false, data: deletedInstRole };
    }

    async getInstitutionWithAllInfo(name: string) {
        const qb = getRepository(InstitutionEntity, this.configService.get('DB_NAME'))
            .createQueryBuilder("institution")
            .leftJoinAndSelect("institution.users", "user", "user.active = :active", { active: true })
            .innerJoinAndSelect("user.roles", "role", "role.name = :roleName", { roleName: 'student'})
            .where("institution.name = :name", { name: name });
        const institutionWithUserAndRole = await qb.getMany();
        return {institutionWithUserAndRole };
    }

    async createInstitution(
        createInstitutionDto: CreateInstitutionDto
    ): Promise<{error: boolean, message?: string, status?: number, data?: any}> {
        const validatedInstitution = await this.validateInstitution(createInstitutionDto);
        if (validatedInstitution.error === true) {
            return validatedInstitution;
        } else {
            const savedInstitution = await this.institutionRepository.save(validatedInstitution.newInstitution);
            return {error: false, data: savedInstitution};
        }
    }

    // async addUser(getUserAndUserRoleDto: GetInstitutionAndUserDto) 
    // : Promise<{error: boolean, message?: string, status?: number, data?: any}> {
    //     const { name, userId } = getUserAndUserRoleDto;
    //     const id = typeof userId === 'string' ? Number(userId) : userId;

    //     //Check if user exist
    //     const userData = await this.userService.getUserById(id);
    //     if (userData.error === true) {
    //         return userData;
    //     }
    //     const user = userData.data;

    //     // Check if institution exist
    //     const institutionData = await this.getInstitutionByName(name, true);
    //     if (institutionData.error === true) {
    //         return institutionData;
    //     }
    //     const institution = institutionData.data;

    //     // Check if user is already added
    //     // const isNewUser = institution?.users?.findIndex(_user => _user.email === user.email) === -1;
    //     // if (!isNewUser) {
    //     //     return { error: true, status: HttpStatus.NOT_ACCEPTABLE, message: 'User already existed'};
    //     // }
    //     // institution.users.push(user);
    //     const userIsAdded = await this.institutionRepository.save(institution);
    //     return { error: false, data: userIsAdded };
    // }

    // async removeUser(getUserAndUserRoleDto: GetInstitutionAndUserDto) 
    // : Promise<{error: boolean, message?: string, status?: number, data?: any}> {
    //     const { name, userId } = getUserAndUserRoleDto;
    //     const id = typeof userId === 'string' ? Number(userId) : userId;
    //     const userData = await this.userService.getUserById(id);
    //     if (userData.error === true) {
    //         return userData;
    //     }
    //     const user = userData.data;
    //     const institutionData = await this.getInstitutionByName(name, true);
    //     if (institutionData.error === true) {
    //         return institutionData;
    //     }
    //     const institution = institutionData.data;

    //     // Check if user exist
    //     const isNewUser = institution.users.findIndex(_user => _user.email === user.email) === -1;
    //     if (isNewUser) {
    //         return { error: true, status: HttpStatus.NOT_ACCEPTABLE, message: 'User does not existed'};
    //     }

    //     const newUsers = institution.users.filter((_user) => _user.email === user.email);
    //     institution.users = newUsers;
    //     await this.institutionRepository.save(institution);
    //     return { error: false, data: user };
    // }

    async addStudentClass(addStudentClassToInstitutionDto: AddStudentClassToInstitutionDto)
    : Promise<{error: boolean, message?: string, status?: number, data?: any}> {
        const { name, institution } = addStudentClassToInstitutionDto;

        // Check if institution exist
        const getInstitutionData = await this.getInstitutionByName(institution, true);
        if (getInstitutionData.error === true) {
            return {
                error: true,
                message: 'Institute does not exist',
                status: HttpStatus.BAD_REQUEST
            };
        }
        const institute = getInstitutionData.data;

        // Check if studentClass exist
        const studentClassData = await this.studentClassService.getStudentClass(name);
        if (studentClassData.error === true) {
            return {
                error: true,
                message: `Student Class ${name} does not exist`,
                status: HttpStatus.BAD_REQUEST
            };
        }

        // add student class to institution
        institute.student_classes.push(studentClassData.data)

        const addedStudentClass = await this.institutionRepository.save(institute);
        return { error: false, data: addedStudentClass };
    }

    async addRole(institutionRoleDto: InstitutionRoleDto)
    : Promise<{error: boolean, message?: string, status?: number, data?: any}> {
        const { name } = institutionRoleDto;
        const getRoleData = await this.getRole(name);
        if (getRoleData.data) {
            return {
                error: true,
                message: 'Institute role already exist',
                status: HttpStatus.BAD_REQUEST
            };
        }
        let newInstRole = new InstitutionRoleEntity();
        newInstRole.name = name;
        const createdInstRole = await this.institutionRoleRepository.save(newInstRole);
        return { error: false, data: createdInstRole };
    }
    async removeRole(institutionRoleDto: InstitutionRoleDto)
    : Promise<{error: boolean, message?: string, status?: number, data?: any}> {
        const { name } = institutionRoleDto;
        const getRoleData = await this.getRole(name);
        if (getRoleData.error === true) {
            return getRoleData;
        }
        const deletedInstRole = await this.institutionRoleRepository.delete({ name });
        return { error: false, data: deletedInstRole };
    }
    async getRole(name: string) 
    : Promise<{error: boolean, message?: string, status?: number, data?: any}> {
        if (!name) {
            return {
                error: true,
                message: 'Institute role name is empty',
                status: HttpStatus.BAD_REQUEST
            };
        }
        const role = await this.institutionRoleRepository.findOne({ name });
        if (!role) {
            return {
                error: true,
                message: `There is no institute role named as ${name}`,
                status: HttpStatus.BAD_REQUEST
            };
        }
        return { error: false, data: role };
    }
    async getRoles() 
    : Promise<{error: boolean, message?: string, status?: number, data?: any}> {
        const roles = await this.institutionRoleRepository.find();
        return { error: false, data: roles };
    }
}