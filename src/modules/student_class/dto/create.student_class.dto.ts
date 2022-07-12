import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateStudentClassDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        type: String,
        default: 'X'
    })
    readonly name: string;
}

export class CreateStudentClassUserDto extends CreateStudentClassDto {
    @IsNotEmpty()
    @ApiProperty({
        type: Number,
        default: 1
    })
    readonly userId: number | string;
}