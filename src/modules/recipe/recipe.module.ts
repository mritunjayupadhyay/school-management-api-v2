import { UserModule } from './../user/user.module';
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CurrentUserMiddleware } from "../user/middlewares/current_user.middleware";
import { IngredientEntity } from "./ingredient.entity";
import { RecipeController } from "./recipe.controller";
import { RecipeEntity } from "./recipe.entity";
import { RecipeService } from "./recipe.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([RecipeEntity, IngredientEntity]),
        UserModule
    ],
    controllers: [RecipeController],
    providers: [RecipeService]
})
export class RecipeModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
          .apply(CurrentUserMiddleware)
          .forRoutes({ path: 'recipe', method: RequestMethod.POST });
    }
}