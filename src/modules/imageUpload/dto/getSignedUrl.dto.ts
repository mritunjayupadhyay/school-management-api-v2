import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsString } from "class-validator";

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

    @IsString()
    @ApiProperty({
        type: String,
        default: 'Y'
    })
    readonly fixedPath: string;
}