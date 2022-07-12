import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class GetAddressByEmailDto {
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({
        type: String,
    })
    email: string;
}