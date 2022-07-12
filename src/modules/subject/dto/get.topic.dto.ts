import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class GetTopicDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        type: String,
        default: 'cards'
    })
    readonly topicName: string;
}