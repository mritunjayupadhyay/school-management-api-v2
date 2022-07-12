import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class GetBookDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        type: String,
        default: 'S N Dey'
    })
    readonly bookName: string;
}