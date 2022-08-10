import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class GetSignedUrlDto {
    @IsString()
    @ApiProperty({
        type: String,
        default: 'school-management-01'
    })
    readonly bucket: string;
    @IsString()
    @ApiProperty({
        type: String,
        default: 'profile'
    })
    readonly key: string;
}