import { Body, Controller, Delete, Get, HttpException, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { ApiHeader, ApiTags } from "@nestjs/swagger";
import { AdminGuard } from "src/guards/admin.guard";
import { AuthGuard } from "src/guards/auth.guard";
import { transformEntity } from "src/interceptors/transform.interceptor";
import { UpdateDateColumn } from "typeorm";
import { CreateUserDto } from "./dto/create.user.dto";
import { GetUserByEmailDto, GetUserByIdDto } from "./dto/get.user.dto";
import { UpdateUserDto } from "./dto/update.user.dto";
import { UserBasicResponseDto } from "./dto/user.dto";
import { UserEntity } from "./user.entity";
import { UserService } from "./user.service";

@ApiTags('User')
@Controller('users')
export class UserController {
    constructor(
        private readonly userService: UserService
    ) {}

    @ApiHeader({
        name:'token',
        description: 'Authentication header',
    })
   @Get('/')
   async getUsers() {
       const users = await this.userService.getUsers();
       return {
           error: false,
           data: users, 
           message: 'This query should use filter, like student for class x'
        };
   }

   @ApiHeader({
    name:'token',
    description: 'Authentication header',
})
//    @transformEntity(UserBasicResponseDto)
   @Get('getUserByEmail') 
   async getUserByEmail(
    @Query() getUserByEmailDto: GetUserByEmailDto
   ) {
       const { email } = getUserByEmailDto;
       const user = await this.userService.getUserByEmail(email);
       console.log("user", user);
       return {error: false, data: user};
   }

   @ApiHeader({
    name:'token',
    description: 'Authentication header',
})
   @transformEntity(UserBasicResponseDto)
   @UseGuards(AdminGuard)
   @Post('/')
   async createUser(
       @Body() createUserDto: CreateUserDto
   ) {
    const { error, data, message, status} = await this.userService.createUser(createUserDto);
    if (error === true) {
        throw new HttpException({
            message
        }, status)
    }
    return { error, data };
   }

   @ApiHeader({
    name:'token',
    description: 'Authentication header',
})
   @Post('/create-multiple-users')
   @UseGuards(AdminGuard)
   async createMultipleUsers(
    @Body() usersDto: CreateUserDto[]
   ) {
       const data = await this.userService.createMultipleUser(usersDto);
       return { error: false, data };
   }

   @ApiHeader({
    name:'token',
    description: 'Authentication header',
})
   @Get('/:userId')
   async getUser(
       @Param() getUserByIdDto: GetUserByIdDto
   ) {
       const { userId } = getUserByIdDto;
       const id = typeof userId === 'string' ? Number(userId) : userId;
       const { error, data, message, status} = await this.userService.getUserById(id);
       if (error === true) {
        throw new HttpException({
            message
        }, status)
    }
    return { error, data };
   }

   @ApiHeader({
    name:'token',
    description: 'Authentication header',
})
   @Get('/:userId/profile')
   async getProfile() {
       return 'Get user profile by userId, which contain user, class, address, programme related to user';
   }

   @Put('/:userId/mobile-verification')
   async setIfMobileIsVerified() {
       return 'mobile-verification'
   }

   @Put('/:userId/email-verification')
   async setIfEmailIsVerified() {
       return 'email-verification'
   }

   @transformEntity(UserBasicResponseDto)
   @ApiHeader({
    name:'token',
    description: 'Authentication header',
   }) 
   @Put('/:userId/')
   async updateUser(
    @Param() getUserByIdDto: GetUserByIdDto,
    @Body() attr: UpdateUserDto
   ) {
       const { userId } = getUserByIdDto;
       const id = typeof userId === 'string' ? Number(userId) : userId;
       const { error, data, message, status} = await this.userService.getAndUpdateUser(id, attr);
       if (error === true) {
            throw new HttpException({
                message
            }, status)
        }
        return { error, data };
   }

   @ApiHeader({
    name:'token',
    description: 'Authentication header',
   })
   @UseGuards(AdminGuard)
   @Delete('/:userId')
   async removeUser(
    @Param() getUserByIdDto: GetUserByIdDto
   ) {
    const { userId } = getUserByIdDto;
    const id = typeof userId === 'string' ? Number(userId) : userId;
    const { error, data, message, status} = await this.userService.getAndRemove(id);
    if (error === true) {
         throw new HttpException({
             message
         }, status)
     }
     return { error, data };
   }

   @ApiHeader({
    name:'token',
    description: 'Authentication header',
   })
   @UseGuards(AdminGuard)
   @Post('activate/:userId')
   async activateUser(
    @Param() getUserByIdDto: GetUserByIdDto
   ) {
    const { userId } = getUserByIdDto;
    const id = typeof userId === 'string' ? Number(userId) : userId;
    const { error, data, message, status} = await this.userService.getAndActivate(id);
    if (error === true) {
         throw new HttpException({
             message
         }, status)
     }
     return { error, data };
   }
}