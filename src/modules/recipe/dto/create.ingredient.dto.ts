import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MinLength } from "class-validator";


export class GetQuestionDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(1)
    @ApiProperty({
        type: String,
        default: 'Kheer'
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

    @IsNotEmpty()
    @IsString()
    @MinLength(2)
    @ApiPropertyOptional({
        type: String,
        default: 'Kheer'
    })
    recipeName: string ;
}