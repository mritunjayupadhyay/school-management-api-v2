import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateSubjectDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        type: String,
        default: 'mathematics'
    })
    readonly subjectName: string;

    @ApiPropertyOptional({
        type: String,
        default: 'description'
    })
    readonly description: string;
}