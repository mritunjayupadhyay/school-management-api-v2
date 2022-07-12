import { HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { validate } from "class-validator";
import { getRepository, Repository } from "typeorm";
import { UserService } from "../user/user.service";
import { GetInstituteUserDto, GetInstitutionUserRole } from "./dto/user.institution.dto";
import { GetInstitutionDto } from "./dto/get.institution.dto";
import { InstitutionUserEntity } from "./institute.user.entity";
import { InstitutionService } from "./institution.service";

@Injectable()
export class InstitutionUserService {
    constructor(
        @InjectRepository(InstitutionUserEntity)
        private readonly institutionUserRepository: Repository<InstitutionUserEntity>,
        private readonly institutionService: InstitutionService,
        private readonly userService: UserService,
        private configService: ConfigService  
    ) {}

    async addUser(getInstitutionUserRole: GetInstitutionUserRole)
    : Promise<{error: boolean, message?: string, status?: number, data?: any}> {
        const { userId, name, role } = getInstitutionUserRole;

        const id = typeof userId === 'string' ? Number(userId) : userId;
        const userData = await this.userService.getUserById(id);
        if (userData.error) {
            return userData;
        }
        const user = userData.data;

        const institutionData = await this.institutionService.getInstitutionByName(name);
        if (institutionData.error) {
            return institutionData;
        }
        const institution = institutionData.data;

        const institutionRoleData = await this.institutionService.getRole(role);
        if (institutionRoleData.error) {
            return institutionRoleData;
        }
        const institutionRole = institutionRoleData.data;

        // create new institution user
        let newInstitutionUser = new InstitutionUserEntity();
        newInstitutionUser.institution = institution;
        newInstitutionUser.user = user;
        newInstitutionUser.institution_role = institutionRole;

        const errors = await validate(newInstitutionUser);
        if (errors.length > 0) {
            return { 
                error: true, 
                message: errors.join(""),
                status: HttpStatus.BAD_REQUEST
            };
        } 
        const createdInstitutionUser = await this.institutionUserRepository.save(newInstitutionUser);
        return {error: false, data: createdInstitutionUser};
    }

    async getUser(getInstitutionUserDto: GetInstituteUserDto) 
    : Promise<{error: boolean, message?: string, status?: number, data?: any}> {
        const { name, role } = getInstitutionUserDto;
        const institutionData = await this.institutionService.getInstitutionByName(name);
        if (institutionData.error) {
            return institutionData;
        }
        const institution = institutionData.data;

        const qb = getRepository(InstitutionUserEntity, this.configService.get('DB_NAME'))
            .createQueryBuilder("institution_user")
            .leftJoinAndSelect("institution_user.institution", "institution", "institution.name = :institutionName", { institutionName: institution.name })
            .innerJoinAndSelect("institution_user.user", "user")
            .leftJoinAndSelect("institution_user.institution_role", "institution_role")
        
        if (role) {
            qb.andWhere("institution_role.name = :roleName", { roleName: role });
        }
        const institutionWithUserAndRole = await qb.getMany();
        return {error: false, data: institutionWithUserAndRole };
    }
}