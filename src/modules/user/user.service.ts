import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { validate } from "class-validator";
import { defaultUserRole } from "src/app.constant";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dto/create.user.dto";
import { UpdateUserDto } from "./dto/update.user.dto";
import { UserEntity } from "./user.entity";
import { UserRoleService } from "./user.role.service";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        private readonly userRoleService: UserRoleService
    ) {}

    async getUsers() {
        return this.userRepository.find({ active: true });
    }

    async validateUser(createUserDto: CreateUserDto)
    : Promise<{error: boolean, message?: string, status?: number, newUser?: UserEntity}> {
        const { firstName, lastName, email, password, mobile, userRole } = createUserDto;

        const role = userRole || defaultUserRole;
        // Check if given role exist
        const roleInDB = await this.userRoleService.getUserRoleByName(role);
        if (!roleInDB) {
            return { 
                error: true, 
                message: `Role ${role} does not exist.`,
                status: HttpStatus.BAD_REQUEST
            };
        }

        // Check if email Exist
        const userWithEmail = await this.getUserByEmail(email);
        if (userWithEmail.data) {
            return { 
                error: true, 
                message: `${email} already in use.`,
                status: HttpStatus.BAD_REQUEST
            };
        }
        // create new user
        let newUser = new UserEntity();
        newUser.email = email;
        newUser.firstName = firstName;
        newUser.lastName = lastName;
        newUser.password = password;
        newUser.mobile = mobile;
        newUser.roles = [roleInDB]

        const errors = await validate(newUser);
        if (errors.length > 0) {
            return { 
                error: true, 
                message: errors.join(""),
                status: HttpStatus.BAD_REQUEST
            };
        } else {
            return {error: false, newUser};
        }
    }

    async createUser(createUserDto: CreateUserDto)
    : Promise<{error: boolean, message?: string, status?: number, data?: UserEntity}> {
        const validatedUser = await this.validateUser(createUserDto);
        if (validatedUser.error === true) {
            return validatedUser;
        } else {
            const savedUser = await this.userRepository.save(validatedUser.newUser);
            return {error: false, data: savedUser};
        }
    }

    async createMultipleUser(usersDto: CreateUserDto[])
    :Promise<{ savedUser: any, unSavedUser: any}> {
        const savedUser = [];
        const unSavedUser = [];
        for (const user of usersDto) {
            const userSavingData = await this.createUser(user);
            if (userSavingData.error === true) {
                unSavedUser.push({
                    errorMessage: userSavingData.message,
                    user
                });
            } else {
                savedUser.push({
                    user: userSavingData.data
                });
            }
        }
        return {savedUser, unSavedUser};
    }

    async getUserByEmail(email: string)
    : Promise<{error: boolean, message?: string, status?: number, data?: UserEntity}> {
        const user = await this.userRepository.findOne({ email, active: true });
        console.log("user", user);
        if (user) {
            return { error: false, data: user };
        }
        return { error: true, status: HttpStatus.NOT_FOUND, message: 'User not found'};
    }

    async getUserById(id: number, inActive?: boolean) 
    : Promise<{error: boolean, message?: string, status?: number, data?: UserEntity}> {
        console.log("user id given to func", id);
        if (!id) {
            return { error: true, status: HttpStatus.BAD_REQUEST, message: 'User id is not given'};
        }
        const user = await this.userRepository.findOne(id);
        console.log("got user by id", user);
        if (user) {
            if (!inActive && user.active === false) {
                return { error: true, status: HttpStatus.MOVED_PERMANENTLY, message: 'User was removed'};
            }
            return { error: false, data: user };
        }
        return { error: true, status: HttpStatus.NOT_FOUND, message: 'User not found'};
    }

    async getAndUpdateUser(id: number, attr: UpdateUserDto) {
        const userData = await this.getUserById(id);
        if (userData.error === true) {
            return userData;
        }
        const user = userData.data;
        Object.assign(user, attr);
        const updatedUser = await this.userRepository.save(user);
        if (updatedUser) {
            return {error: false, data: updatedUser};
        }
        return {
            error: true,
            status: HttpStatus.NOT_MODIFIED,
            message: 'Error in user update'
        }
    }
    async getAndRemove(id: number) {
        const userData = await this.getUserById(id);
        if (userData.error === true) {
            return userData;
        }
        const user = userData.data;
        user.active = false;
        const updatedUser = await this.userRepository.save(user);
        if (updatedUser) {
            return {error: false, data: updatedUser};
        }
        return {
            error: true,
            status: HttpStatus.NOT_MODIFIED,
            message: 'Error in user update'
        }
    }
    async getAndActivate(id: number) {
        const userData = await this.getUserById(id, true);
        if (userData.error === true) {
            return userData;
        }
        const user = userData.data;
        user.active = true;
        const updatedUser = await this.userRepository.save(user);
        if (updatedUser) {
            return {error: false, data: updatedUser};
        }
        return {
            error: true,
            status: HttpStatus.NOT_MODIFIED,
            message: 'Error in user update'
        }
    }
}