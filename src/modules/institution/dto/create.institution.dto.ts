import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { InstitutionLabel } from "../institution.entity";

export class CreateInstitutionDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        type: String,
        default: 'Pragati Sheel Hindi Vidyalaya'
    })
    readonly name: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        enum: InstitutionLabel,
        default: InstitutionLabel.SCHOOL
    })
    readonly label: string;
}