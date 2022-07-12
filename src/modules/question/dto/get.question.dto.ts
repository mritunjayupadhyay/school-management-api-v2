import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, isBoolean, IsEmail, IsNotEmpty, IsNumber, IsString, MinLength } from "class-validator";
import { ViewType } from "../questionMCQ.entity";

export class GetQuestionDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(1)
    @ApiProperty({
        type: String,
        default: 'What will be the probability of getting odd numbers if a dice is thrown?'
    })
    questionText: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        type: String,
        default: 'cards'
    })
    topicName: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        type: String,
        default: 'probability'
    })
    moduleName: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        type: String,
        default: 'mathematics'
    })
    subjectName: string;

}