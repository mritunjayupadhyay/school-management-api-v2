import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        type: String,
        default: '1234'
    })
    readonly password: string;

    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({
        type: String,
        default: 'mupadhyay@gmail.com'
    })
    readonly email: string;
}

export class TokenDto {
    @IsString()
    @ApiProperty({
        type: String,
        default: 'Bearer token'
    })
    readonly token: string;
}