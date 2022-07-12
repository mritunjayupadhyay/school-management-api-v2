import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";
import { Gender } from "../user.entity";

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(1)
    @ApiProperty({
        type: String,
        default: 'Mritunjay'
    })
    readonly firstName: string;

    @ApiPropertyOptional({
        type: String,
        default: 'Upadhyay'
    })
    readonly lastName: string;

    @ApiProperty({
        enum: Gender,
        default: Gender.MALE
    })
    gender: string;

    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({
        type: String,
        default: 'mupadhyay@gmail.com'
    })
    readonly email: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        type: String,
        default: '974541160'
    })
    readonly mobile: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(4)
    @ApiProperty({
        type: String,
        default: '1234'
    })
    readonly password: string;

    @ApiPropertyOptional({
        type: String,
        default: ''
    })
    profilePic: string;

    @ApiPropertyOptional({
        type: String,
        default: 'student'
    })
    readonly userRole: string;
}