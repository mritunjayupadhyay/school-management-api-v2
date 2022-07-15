import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class GetRecipeDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        type: String,
        default: 'Kheer'
    })
    readonly recipeName: string;
}