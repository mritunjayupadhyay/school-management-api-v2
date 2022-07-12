import { Expose, Type } from "class-transformer";
import { UserRoleResponseDto } from "./role.dto";

export class UserBasicResponseDto {
    @Expose()
    firstName: string;
    @Expose()
    lastName: string;
    @Expose()
    gender: string;
    @Expose()
    email: string;
    @Expose()
    profilePic: string;
    @Expose()
    @Type(() => UserRoleResponseDto)
    roles: UserRoleResponseDto[];
}

export class UserBasicResponseWithTokenDto {
    @Expose()
    token: string;
    
    @Expose()
    @Type(() => UserBasicResponseDto)
    user: UserBasicResponseDto;
}