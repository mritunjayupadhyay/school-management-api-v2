import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProgrammeEntity } from "./entity/programme.entity";
import { ProgrammeController } from "./programme.controller";
import { ProgrammeService } from "./programme.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([ProgrammeEntity]),
    ],
    controllers: [ProgrammeController],
    providers: [ProgrammeService]
})
export class ProgrammeModule {}