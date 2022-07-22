import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";
import { GetRecipeDto } from "./recipe.dto";

export class GetIngredientDto extends GetRecipeDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        type: String,
        default: 'milk'
    })
    readonly ingredientName: string;
}

export class IngredientBasicResponseDto {
    @Expose()
    name: string;
    @Expose()
    description: string;
    @Expose()
    id: number;
    @Expose()
    amount: string;
}