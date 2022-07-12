import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateBookDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        type: String,
        default: 'mathematics'
    })
    readonly bookName: string;

    @ApiPropertyOptional({
        type: String,
        default: 'description'
    })
    readonly description: string;

    @ApiProperty({
        type: [String],
        default: ['author']
    })
    readonly authors: string[]

    @ApiProperty({
        type: String,
        default: 'publication A'
    })
    publication: string;

    @ApiProperty({
        type: Number,
        default: 100
    })
    price: number;

    @ApiProperty({
        type: Number,
        default: 120
    })
    selling_price: number;

    @ApiPropertyOptional({
        type: String,
        default: 'mathematics'
    })
    subjectName: string;
}