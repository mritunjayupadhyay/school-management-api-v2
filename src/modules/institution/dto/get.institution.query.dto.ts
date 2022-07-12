import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class GetInstitutionQueryDto {
    @ApiPropertyOptional({
        type: String,
        default: 'X'
    })
    readonly studentClass: string;
}