import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class InstitutionRoleDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        type: String,
        default: 'student'
    })
    readonly name: string;
}