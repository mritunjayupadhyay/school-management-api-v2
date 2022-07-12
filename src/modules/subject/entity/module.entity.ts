import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { SubjectEntity } from "./subject.entity";
import { TopicEntity } from "./topic.entity";

@Entity('module')
export class ModuleEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @PrimaryColumn({ unique: true })
    name: string;

    @Column()
    desc: string;

    @ManyToOne(() => SubjectEntity, subject => subject.books)
    subject: SubjectEntity;

    @OneToMany(() => TopicEntity, topic => topic.module)
    topics: TopicEntity[];
}