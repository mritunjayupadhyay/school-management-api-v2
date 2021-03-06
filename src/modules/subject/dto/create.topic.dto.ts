import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateTopicDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        type: String,
        default: 'cards'
    })
    readonly topicName: string;

    @ApiPropertyOptional({
        type: String,
        default: 'description'
    })
    readonly description: string;

    @ApiProperty({
        type: String,
        default: 'mathematics'
    })
    subjectName: string;

    @ApiProperty({
        type: String,
        default: 'probability'
    })
    moduleName: string;
}