import { Column, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { ModuleEntity } from "./module.entity";
import { SubjectEntity } from "./subject.entity";

@Entity('topic')
export class TopicEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @PrimaryColumn({ unique: true })
    name: string;

    @Column()
    desc: string;

    @ManyToOne(() => SubjectEntity, subject => subject.books)
    subject: SubjectEntity;

    @ManyToOne(() => ModuleEntity, module => module.topics)
    module: ModuleEntity;
}