import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class GetStudentDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        type: String,
        default: 'X'
    })
    readonly name: string;
}