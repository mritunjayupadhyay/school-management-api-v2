import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { GetUserByIdDto } from "src/modules/user/dto/get.user.dto";

export class AddUserToStudentClassDto extends GetUserByIdDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        type: String,
        default: 'X'
    })
    readonly studentClassName: string;
}