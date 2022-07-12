import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { GetInstitutionDto } from "./get.institution.dto";

export class GetInstitutionAndUserDto extends GetInstitutionDto {
    @IsNotEmpty()
    @ApiProperty({
        type: Number,
        default: 1
    })
    readonly userId: number | string;
}

export class GetInstitutionUserRole extends GetInstitutionAndUserDto {
    @IsNotEmpty()
    @ApiProperty({
        type: String,
        default: 'student'
    })
    readonly role: string;
}

export class GetInstituteUserDto extends GetInstitutionDto{
    @ApiPropertyOptional({
        type: String,
        default: 'student'
    })
    readonly role: string;
}