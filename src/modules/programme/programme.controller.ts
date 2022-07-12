import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ProgrammeService } from "./programme.service";

@ApiTags('Programme')
@Controller('programme')
export class ProgrammeController {
    constructor(
        private readonly programmeService: ProgrammeService
    ) {}

    @Get('/')
    getProgramme() {
        return this.programmeService.getProgramme();
    }
}