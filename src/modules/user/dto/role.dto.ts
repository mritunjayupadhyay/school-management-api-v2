import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";
import { GetUserByIdDto } from "./get.user.dto";

export class CreateUserRoleDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        type: String,
        default: 'student'
    })
    readonly name: string;
}

export class UserRoleResponseDto {
    @Expose()
    name: string;
}

export class GetUserRoleDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        type: String,
        default: 'student'
    })
    readonly name: string;
}

export class GetUserAndUserRoleDto extends GetUserRoleDto {
    @IsNotEmpty()
    @ApiProperty({
        type: Number,
        default: 1
    })
    readonly userId: number | string;
}