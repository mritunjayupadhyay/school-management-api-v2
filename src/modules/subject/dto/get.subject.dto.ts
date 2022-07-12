import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class GetSubjectDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        type: String,
        default: 'mathematics'
    })
    readonly subjectName: string;
}