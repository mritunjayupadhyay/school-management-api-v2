import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateModuleDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        type: String,
        default: 'probability'
    })
    readonly moduleName: string;

    @ApiPropertyOptional({
        type: String,
        default: 'description'
    })
    readonly description: string;

    @ApiProperty({
        type: String,
        default: 'mathematics'
    })
    subjectName: string;
}