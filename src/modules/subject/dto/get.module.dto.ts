import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class GetModuleDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        type: String,
        default: 'probability'
    })
    readonly moduleName: string;
}