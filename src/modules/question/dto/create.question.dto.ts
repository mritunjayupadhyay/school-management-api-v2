import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, isBoolean, IsEmail, IsNotEmpty, IsNumber, IsString, MinLength } from "class-validator";
import { ViewType } from "../questionMCQ.entity";

export class CreateQuestionDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(1)
    @ApiProperty({
        type: String,
        default: 'What will be the probability of getting odd numbers if a dice is thrown?'
    })
    readonly questionText: string;

    @ApiProperty({
        enum: ViewType,
        default: ViewType.TEXT
    })
    questionType: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(1)
    @ApiProperty({
        type: String,
        default: '1/2'
    })
    readonly optionA: string;

    @IsBoolean()
    @ApiProperty({
        type: Boolean,
        default: false
    })
    readonly optionAValue: boolean;

    @ApiProperty({
        enum: ViewType,
        default: ViewType.TEXT
    })
    optionAType: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(1)
    @ApiProperty({
        type: String,
        default: '1/2'
    })
    readonly optionB: string;

    @IsBoolean()
    @ApiProperty({
        type: Boolean,
        default: false
    })
    readonly optionBValue: boolean;

    @ApiProperty({
        enum: ViewType,
        default: ViewType.TEXT
    })
    optionBType: string;


    @IsNotEmpty()
    @IsString()
    @MinLength(1)
    @ApiProperty({
        type: String,
        default: '1/2'
    })
    readonly optionC: string;

    @IsBoolean()
    @ApiProperty({
        type: Boolean,
        default: false
    })
    readonly optionCValue: boolean;

    @ApiProperty({
        enum: ViewType,
        default: ViewType.TEXT
    })
    optionCType: string;


    @IsNotEmpty()
    @IsString()
    @MinLength(1)
    @ApiProperty({
        type: String,
        default: '1/2'
    })
    readonly optionD: string;

    @IsBoolean()
    @ApiProperty({
        type: Boolean,
        default: false
    })
    readonly optionDValue: boolean;

    @ApiProperty({
        enum: ViewType,
        default: ViewType.TEXT
    })
    optionDType: string;

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({
        type: Number,
        default: 0
    })
    readonly level: number;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        type: String,
        default: 'cards'
    })
    readonly topicName: string;

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