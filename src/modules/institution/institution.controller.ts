import { Body, Controller, Delete, Get, HttpException, Param, Post, Put, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { GetInstituteUserDto, GetInstitutionAndUserDto, GetInstitutionUserRole } from "./dto/user.institution.dto";
import { CreateInstitutionDto } from "./dto/create.institution.dto";
import { AddStudentClassToInstitutionDto, GetInstitutionDto } from "./dto/get.institution.dto";
import { InstitutionRoleDto } from "./dto/institution.role.dto";
import { InstitutionService } from "./institution.service";
import { InstitutionUserService } from "./institution.user.service";
import { GetStudentDto } from "../student_class/dto/get.student_class.dto";
import { GetInstitutionQueryDto } from "./dto/get.institution.query.dto";

@ApiTags('Institution')
@Controller('institution')
export class InstitutionController {
    constructor(
        private readonly institutionService: InstitutionService,
        private readonly institutionUserService: InstitutionUserService
    ) {}

    @Get('/')
    async getInstitution(
        @Query() getInstitutionQueryDto: GetInstitutionQueryDto
    ) {
        const { error, data, message, status} = await this.institutionService.getInstitution(getInstitutionQueryDto);
        if (error === true) {
            throw new HttpException({
                message
            }, status)
        }
        return { error, data };
    }

    @Post('/')
    async createInstitution(
        @Body() createInstitutionDto: CreateInstitutionDto
    ) {
        const { error, data, message, status} = await this.institutionService.createInstitution(createInstitutionDto);
        if (error === true) {
            throw new HttpException({
                message
            }, status)
        }
        return { error, data };
    }

    @Post('/add-user')
    async addUser(
        @Body() getInstitutionUserRole: GetInstitutionUserRole
    ) {
        const { error, data, message, status} = await this.institutionUserService.addUser(getInstitutionUserRole);
        if (error === true) {
            throw new HttpException({
                message
            }, status)
        }
        return { error, data };
    }

    @Get('/get-user')
    async getUser(
        @Query() getInstitutionUserDto: GetInstituteUserDto
    ) {
        const { error, data, message, status} = await this.institutionUserService.getUser(getInstitutionUserDto);
        if (error === true) {
            throw new HttpException({
                message
            }, status)
        }
        return { error, data };
    }
   
//    @Delete('/:userId/remove-user/:name')
//    async removeUser(
//     @Param() getInstitutionAndUserDto: GetInstitutionAndUserDto
//    ) {
//     const { error, data, message, status} = await this.institutionService.removeUser(getInstitutionAndUserDto);
//     if (error === true) {
//          throw new HttpException({
//              message
//          }, status)
//      }
//      return { error, data };
//    }

   @Post('/add-role')
   async addRole(
    @Body() institutionRoleDto: InstitutionRoleDto
   ) {
    const { error, data, message, status} = await this.institutionService.addRole(institutionRoleDto);
    if (error === true) {
         throw new HttpException({
             message
         }, status)
     }
     return { error, data };
   }

   @Post('/add-student-class')
   async addStudentClass(
    @Body() addStudentClassToInstitutionDto: AddStudentClassToInstitutionDto
   ) {
    const { error, data, message, status} = await this.institutionService.addStudentClass(addStudentClassToInstitutionDto);
    if (error === true) {
         throw new HttpException({
             message
         }, status)
     }
     return { error, data };
   }

   @Delete('/remove-role')
   async removeRole(
    @Body() institutionRoleDto: InstitutionRoleDto
   ) {
    const { error, data, message, status} = await this.institutionService.removeRole(institutionRoleDto);
    if (error === true) {
         throw new HttpException({
             message
         }, status)
     }
     return { error, data };
   }


   @Get('/roles')
   async getRole() {
    const { error, data, message, status} = await this.institutionService.getRoles();
    if (error === true) {
         throw new HttpException({
             message
         }, status)
     }
     return { error, data };
   }

   @Get('/:name')
    async getInstitutionWithName(
        @Param() getInstitutionDto: GetInstitutionDto
    ) {
        const { name } = getInstitutionDto;
        const { error, data, message, status} = await this.institutionService.getInstitutionByName(name, true);
        const allData = await this.institutionService.getInstitutionByName(name, true);
        if (error === true) {
            throw new HttpException({
                message
            }, status)
        }
        return { error, data: allData };
    }

    @Delete('/:name')
    async deleteInstitutionWithName(
        @Param() getInstitutionDto: GetInstitutionDto
    ) {
        const { error, data, message, status} = await this.institutionService.deleteInstitutionWithName(getInstitutionDto);
        if (error === true) {
            throw new HttpException({
                message
            }, status)
        }
        return { error, data };
    }
}