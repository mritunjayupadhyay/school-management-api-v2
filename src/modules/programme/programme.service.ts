import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ProgrammeEntity } from "./entity/programme.entity";

@Injectable()
export class ProgrammeService {
    constructor(
        @InjectRepository(ProgrammeEntity)
        private readonly programmeRepository: Repository<ProgrammeEntity> 
    ) {}

    async getProgramme() {
        return this.programmeRepository.find();
    }
}