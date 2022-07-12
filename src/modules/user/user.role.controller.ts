import { Body, Controller, Delete, Get, HttpException, Param, Post, Put } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CreateUserRoleDto, GetUserAndUserRoleDto, GetUserRoleDto } from "./dto/role.dto";
import { UserRoleService } from "./user.role.service";

@ApiTags('UserRole')
@Controller('user-role')
export class UserRoleController {
    constructor(
        private readonly userRoleService: UserRoleService
    ) {}

   @Get('/')
   async getUserRoles() {
       const roles = await this.userRoleService.getUserRoles();
       return roles;
   }

   @Post('/')
   async createUserRole(
       @Body() createUserDto: CreateUserRoleDto
   ) {
    const { error, message, data, status } = await this.userRoleService.createUserRole(createUserDto);
    if (error === true) {
        throw new HttpException({
            message
        }, status)
    }
    return { error, data };
   }

   @Delete('/:name')
   async removeUser(
    @Param() getUserRoleDto: GetUserRoleDto
   ) {
    const { name } = getUserRoleDto;
    const { error, data, message, status} = await this.userRoleService.getAndRemove(name);
    if (error === true) {
         throw new HttpException({
             message
         }, status)
     }
     return { error, data };
   }

   @Put('/:userId/add-role/:name')
   async addRoleToUser(
    @Param() getUserAndUserRoleDto: GetUserAndUserRoleDto
   ) {
    const { error, data, message, status} = await this.userRoleService.addRoleToUser(getUserAndUserRoleDto);
    if (error === true) {
         throw new HttpException({
             message
         }, status)
     }
     return { error, data };
   }
   
   @Delete('/:userId/remove-role/:name')
   async removeRoleFromUser(
    @Param() getUserAndUserRoleDto: GetUserAndUserRoleDto
   ) {
    const { error, data, message, status} = await this.userRoleService.removeRoleToUser(getUserAndUserRoleDto);
    if (error === true) {
         throw new HttpException({
             message
         }, status)
     }
     return { error, data };
   }
}