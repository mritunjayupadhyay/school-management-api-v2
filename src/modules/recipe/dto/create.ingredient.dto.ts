import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MinLength } from "class-validator";


export class CreateIngredientDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(1)
    @ApiProperty({
        type: String,
        default: 'milk'
    })
    name: string;

    @ApiPropertyOptional({
        type: String,
        default: 'It is a indian sweet dish.'
    })
    description: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(2)
    @ApiPropertyOptional({
        type: String,
        default: '2 kg milk'
    })
    amount: string;
}

export class UpdateIngredientDto {
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
        default: '2 kg milk'
    })
    amount: string;
}