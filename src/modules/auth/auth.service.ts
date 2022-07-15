import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { CreateUserDto } from "../user/dto/create.user.dto";
import { UpdateUserDto } from "../user/dto/update.user.dto";
import { UserEntity } from "../user/user.entity";
import { UserService } from "../user/user.service";
import { LoginDto } from "./dto/login.dto";

@Injectable()
export class AuthService {
    constructor(
        private configService: ConfigService,
        private readonly userService: UserService
    ) {}

    async signUp(createUserDto: CreateUserDto)
    : Promise<{error: boolean, message?: string, status?: number, data?: { user: UserEntity, token: string }}> {
        const { error, data, message, status} = await this.userService.createUser(createUserDto);
        console.log("created user", data);
        if (error === true) {
            return {
                error,
                message,
                status
            };
        } 
        const token = await this.generateJwtToken(data.id);
        console.log("user and token", token, data);
        return {error: false, data: {user: data, token } };
    }
    async signIn(loginDto: LoginDto, isRecipe?: boolean)
    : Promise<{error: boolean, message?: string, status?: number, data?: any}> {
        const { email, password } = loginDto;
        const userData = await this.userService.getUserByEmail(email);
        if (userData.error === true) {
            return {
                error: userData.error,
                message: userData.message,
                status: userData.status
            }
        }
        const user = userData.data;
        if (isRecipe === true) {
            const roles = user && user.roles && Array.isArray(user.roles) ? user.roles.map(role => role.name) : [];
            console.log("this is roles user have", roles);
            if (!roles.includes('recipeAdmin')) {
                return {
                    error: true,
                    message: 'Wrong Credential',
                    status: HttpStatus.BAD_REQUEST
                }
            }
        }
        const isPasswordMatch = await this.checkPassword(password, user.password);
        if (!isPasswordMatch) {
            return {
                error: true,
                message: 'Wrong Credential',
                status: HttpStatus.BAD_REQUEST
            }
        }
        
        const token = await this.generateJwtToken(user.id)
        return {error: false, data: token};
    }
    async checkPassword(bodyPassword, dbPassword) {
        return bcrypt.compare(bodyPassword, dbPassword);
    }
    async generateJwtToken(userId: number) {
        return jwt.sign({ userId }, this.configService.get("JWTPRIVATEKEY"), { expiresIn: '24h'});
    }
    getValueFromToken(authorization) {
        if (!authorization) return null;
        const token = authorization.split(' ')[1];
        return jwt.verify(token, this.configService.get("JWTPRIVATEKEY"));
    }

    async updateMe(user: UserEntity, attr: UpdateUserDto) {
        if (user && user.id) {
            const { error, data, message, status} = await this.userService.getAndUpdateUser(user.id, attr);
            if (error === true) {
                return {
                    error,
                    message,
                    status      
                };
            }
            return {
                error: false,
                data
            };
        }
        return { error: true, message: 'You are not sign in', status: HttpStatus.BAD_REQUEST };
    }

    async deleteMe(user: UserEntity) {
        if (user && user.id) {
            const { error, data, message, status} = await this.userService.getAndRemove(user.id);
            if (error === true) {
                return {
                    error,
                    message,
                    status      
                };
            }
            return {
                error: false,
                data
            };
        }
        return { error: true, message: 'You are not sign in', status: HttpStatus.BAD_REQUEST };
    }
}