import { Body, Controller, Delete, Get, HttpException, HttpStatus, Post, Put } from "@nestjs/common";
import { ApiHeader } from "@nestjs/swagger";
import { CurrentUser } from "src/decorators/current_user.decorator";
import { transformEntity } from "src/interceptors/transform.interceptor";
import { CreateUserDto } from "../user/dto/create.user.dto";
import { UpdateUserDto } from "../user/dto/update.user.dto";
import { UserBasicResponseDto, UserBasicResponseWithTokenDto } from "../user/dto/user.dto";
import { AuthService } from "./auth.service";
import { LoginDto, TokenDto } from "./dto/login.dto";

@Controller()
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) {}

   @transformEntity(UserBasicResponseWithTokenDto)
   @Post('/sign-up')
   async signUp(
    @Body() createUserDto: CreateUserDto
   ) {
    const { error, data, message, status} = await this.authService.signUp(createUserDto);
    if (error === true) {
        throw new HttpException({
            message
        }, status)
    }
    return { error, data };
   }

   @Post('sign-in')
   async signIn(
    @Body() loginDto: LoginDto
   ) {
    const { error, data, message, status} = await this.authService.signIn(loginDto);
    if (error === true) {
        throw new HttpException({
            message
        }, status)
    }
    return { error, data };
   }

   @transformEntity(UserBasicResponseDto)
   @Get('me')
   @ApiHeader({
    name:'token',
    description: 'Authentication header',
   })
   async getUser(
    @CurrentUser() currentUser: any
   ) {
    console.log("this is current user", currentUser);
    if (currentUser) {
        return { error: false, data: currentUser };
    }
    throw new HttpException({
        message: 'you are not current signed in'
    }, HttpStatus.BAD_REQUEST)
   }

   @transformEntity(UserBasicResponseDto)
   @Put('me')
   @ApiHeader({
    name:'token',
    description: 'Authentication header',
   })
   async updateMe(
    @CurrentUser() currentUser: any,
    @Body() attr: UpdateUserDto
   ) {
    console.log("this is current user", currentUser);
    if (currentUser) {
        const { error, data, status, message } = await this.authService.updateMe(currentUser, attr);
        if (error === true) {
            throw new HttpException({
                message
            }, status)
        }
        return { error: false, data };
    }
    throw new HttpException({
        message: 'you are not current signed in'
    }, HttpStatus.BAD_REQUEST)
   }

   @Delete('me')
   @ApiHeader({
    name:'token',
    description: 'Authentication header',
   })
   async deleteMe(
    @CurrentUser() currentUser: any
   ) {
    console.log("this is current user", currentUser);
    if (currentUser) {
        const { error, data, status, message } = await this.authService.deleteMe(currentUser);
        if (error === true) {
            throw new HttpException({
                message
            }, status)
        }
        return { error: false, data };
    }
    throw new HttpException({
        message: 'you are not current signed in'
    }, HttpStatus.BAD_REQUEST);
   }
}