import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { validate } from "class-validator";
import { Repository } from "typeorm";
import { CreateUserRoleDto, GetUserAndUserRoleDto } from "./dto/role.dto";
import { UserEntity } from "./user.entity";
import { UserRoleEntity } from "./user.role.entity";
import { UserService } from "./user.service";

@Injectable()
export class UserRoleService {
    constructor(
        @InjectRepository(UserRoleEntity)
        private readonly userRoleRepository: Repository<UserRoleEntity>,
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>
    ) {}

    async getUserRoles() {
        const roles = await this.userRoleRepository.find();
        return roles;
    }

    async getUserRoleByName(name: string) {
        return await this.userRoleRepository.findOne({ name })
    }

    async createUserRole(createUserDto: CreateUserRoleDto) {
        const { name } = createUserDto;
        const userRole = new UserRoleEntity();
        userRole.name = name;

        const errors = await validate(userRole);
        if (errors.length > 0) {
            const _errors = {username: 'Userinput is not valid.'};
            return {
                error: true,
                status: HttpStatus.BAD_REQUEST,
                message: 'Input data validation failed', _errors
            }
        } 
        const savedUserRole = await this.userRoleRepository.save(userRole);
        return {error: false, data: savedUserRole};
    }
    async getUserRole(name: string) 
    : Promise<{error: boolean, message?: string, status?: number, data?: any}> {
        const userRole = await this.userRoleRepository.findOne({ name });
        if (userRole) {
            return { error: false, data: userRole };
        }
        return { error: true, status: HttpStatus.NOT_FOUND, message: 'User Role not found'};
    }
    async getAndRemove(name: string)
    : Promise<{error: boolean, message?: string, status?: number, data?: any}> {
        const userRoleData = await this.getUserRole(name);
        if (userRoleData.error === true) {
            return userRoleData;
        }
        await this.userRoleRepository.delete({ name });
        return { error: false, data: `User Role ${name} is deleted` };
    }
    async addRoleToUser(getUserAndUserRoleDto: GetUserAndUserRoleDto) 
    : Promise<{error: boolean, message?: string, status?: number, data?: any}> {
        const { name, userId } = getUserAndUserRoleDto;
        const id = typeof userId === 'string' ? Number(userId) : userId;
        const user = await this.userRepository.findOne(id);
        if (!user) {
            return { error: true, status: HttpStatus.NOT_FOUND, message: 'User not found'};
        }
        if (user.active === false) {
            return { error: true, status: HttpStatus.MOVED_PERMANENTLY, message: 'User was removed'};
        }
        const userRoleData = await this.getUserRole(name);
        if (userRoleData.error === true) {
            return userRoleData;
        }
        const userRole = userRoleData.data;

        // Check if role is already added
        const isNewRole = user.roles.findIndex(_role => _role.name === userRole.name) < 0;
        if (!isNewRole) {
            return { error: true, status: HttpStatus.CONFLICT, message: 'Role already existed'};
        }

        user.roles.push(userRole);
        const userAfterAddingRole = await this.userRepository.save(user);
        return { error: false, data: userAfterAddingRole };
    }

    async removeRoleToUser(getUserAndUserRoleDto: GetUserAndUserRoleDto) 
    : Promise<{error: boolean, message?: string, status?: number, data?: any}> {
        const { name, userId } = getUserAndUserRoleDto;
        const id = typeof userId === 'string' ? Number(userId) : userId;
        const user = await this.userRepository.findOne(id);
        if (!user) {
            return { error: true, status: HttpStatus.NOT_FOUND, message: 'User not found'};
        }
        if (user.active === false) {
            return { error: true, status: HttpStatus.MOVED_PERMANENTLY, message: 'User was removed'};
        }
        const userRoleData = await this.getUserRole(name);
        if (userRoleData.error === true) {
            return userRoleData;
        }
        const userRole = userRoleData.data;
        
        // Check if role is there
        const isRoleAvailable = user.roles.findIndex(_role => _role.name === userRole.name) > -1;
        if (!isRoleAvailable) {
            return { error: true, status: HttpStatus.NOT_ACCEPTABLE, message: 'Role is not available'};
        }
        const newRoles = user.roles.filter((_role) => _role.name !== userRole.name);
        user.roles = newRoles;
        const userAfterAddingRole = await this.userRepository.save(user);
        return { error: false, data: userAfterAddingRole };
    }
}