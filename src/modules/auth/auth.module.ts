import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { CurrentUserMiddleware } from "../user/middlewares/current_user.middleware";
import { UserModule } from "../user/user.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

@Module({
    imports: [UserModule],
    controllers: [AuthController],
    providers: [AuthService]
})
export class AuthModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
          .apply(CurrentUserMiddleware)
          .forRoutes('me');
      }
}