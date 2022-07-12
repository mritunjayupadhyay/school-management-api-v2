import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CurrentUserMiddleware } from "./middlewares/current_user.middleware";
import { LoggerMiddleware } from "./middlewares/logger.middleware";
import { UserController } from "./user.controller";
import { UserEntity } from "./user.entity";
import { UserRoleController } from "./user.role.controller";
import { UserRoleEntity } from "./user.role.entity";
import { UserRoleService } from "./user.role.service";
import { UserService } from "./user.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity, UserRoleEntity]),
    ],
    controllers: [UserController, UserRoleController],
    providers: [UserService, UserRoleService],
    exports: [UserService]
})
export class UserModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
          .apply(CurrentUserMiddleware)
          .forRoutes(UserController);
      }
}