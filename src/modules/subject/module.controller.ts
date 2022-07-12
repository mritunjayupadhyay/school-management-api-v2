import { Body, Controller, Delete, Get, HttpException, Param, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { BookService } from "./book.service";
import { CreateBookDto } from "./dto/create.book.dto";
import { CreateModuleDto } from "./dto/create.module.dto";
import { GetBookDto } from "./dto/get.book.dto";
import { GetModuleDto } from "./dto/get.module.dto";
import { ModuleService } from "./module.service";

@ApiTags('Module')
@Controller('modules')
export class ModuleController {
    constructor(
        private readonly moduleService: ModuleService
    ) {}

    @Get('/')
    async getModule() {
        const { error, data, message, status} = await this.moduleService.getModules();
        if (error === true) {
                throw new HttpException({
                    message
                }, status)
        }
        return { error, data };
    }

    @Post('/')
    async createModule(
        @Body() createModuleDto: CreateModuleDto
    ) {
        const { error, data, message, status} = await this.moduleService.createModule(createModuleDto);
        if (error === true) {
                throw new HttpException({
                    message
                }, status)
        }
        return { error, data };
    }

    @Get('/:moduleName')
    async getSubject(
        @Param() getModuleDto: GetModuleDto
    ) {
        const { moduleName } = getModuleDto;
        const { error, data, message, status} = await this.moduleService.getModule(moduleName);
        if (error === true) {
                throw new HttpException({
                    message
                }, status)
        }
        return { error, data };
    }

    @Delete('/:moduleName')
    async deleteSubject(
        @Param() getModuleDto: GetModuleDto
    ) {
        const { moduleName } = getModuleDto;
        return this.moduleService.deleteModule(moduleName);
    }
}