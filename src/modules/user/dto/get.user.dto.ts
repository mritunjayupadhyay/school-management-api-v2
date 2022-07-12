import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class GetUserByEmailDto {
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    @ApiProperty({
        type: String,
        default: 'mupadhyay@gmail.com'
    })
    readonly email: string;
}

export class GetUserByIdDto {
    @IsNotEmpty()
    @ApiProperty({
        type: Number,
        default: 1
    })
    readonly userId: number | string;
}