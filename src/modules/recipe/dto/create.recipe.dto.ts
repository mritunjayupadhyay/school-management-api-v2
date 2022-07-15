import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateRecipeDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(1)
    @ApiProperty({
        type: String,
        default: 'Kheer'
    })
    name: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(1)
    @ApiProperty({
        type: String,
        default: 'It is a indian sweet dish.'
    })
    description: string;

    @ApiPropertyOptional({
        type: String,
        default: 'image url'
    })
    recipePic: string;
}

export class UpdateRecipeDto {
    @ApiPropertyOptional({
        type: String,
        default: 'kheer new name'
    })
    name: string;

    @ApiPropertyOptional({
        type: String,
        default: 'image url'
    })
    description: string;

    @ApiPropertyOptional({
        type: String,
        default: 'image url'
    })
    recipePic: string;
}