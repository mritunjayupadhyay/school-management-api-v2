import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString } from "class-validator";
import { Gender } from "../user.entity";

export class UpdateUserDto {
    @IsString()
    @IsOptional()
    @ApiPropertyOptional({
        type: String,
        default: ''
    })
    firstName: string;
    
    @IsString()
    @IsOptional()
    @ApiPropertyOptional({
        type: String,
        default: ''
    })
    lastName: string;
    
    @IsString()
    @IsOptional()
    @ApiPropertyOptional({
        enum: Gender,
        default: Gender.MALE
    })
    gender: string;
    
    @IsOptional()
    @ApiPropertyOptional({
        type: String,
        default: ''
    })
    profilePic: string;
}