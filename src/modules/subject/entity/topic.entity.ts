import { QuestionMCQEntity } from "src/modules/question/questionMCQ.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
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

    @ManyToOne(() => ModuleEntity, module => module.topics)
    module: ModuleEntity;

    @OneToMany(() => QuestionMCQEntity, mcq_question => mcq_question.topic)
    mcq_questions: QuestionMCQEntity[];
}