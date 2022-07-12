import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { GetStudentDto } from "src/modules/student_class/dto/get.student_class.dto";

export class GetInstitutionDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        type: String,
        default: 'Pragati Sheel Hindi Vidyalaya'
    })
    readonly name: string;
}

export class AddStudentClassToInstitutionDto extends GetStudentDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        type: String,
        default: 'Pragati Sheel Hindi Vidyalaya'
    })
    readonly institution: string;
}