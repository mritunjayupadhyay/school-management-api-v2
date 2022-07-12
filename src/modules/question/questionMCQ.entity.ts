import { Column, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { ModuleEntity } from "../subject/entity/module.entity";
import { SubjectEntity } from "../subject/entity/subject.entity";
import { TopicEntity } from "../subject/entity/topic.entity";

export enum ViewType {
    TEXT = "text",
    IMAGE = "image"
}

@Entity('mcq_question')
export class QuestionMCQEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    questionText: string;

    @Column({
        type: "enum",
        enum: ViewType,
        default: ViewType.TEXT
    })
    questionType: ViewType

    @Column()
    optionA: string;

    @Column({ default: false })
    optionAValue: boolean;

    @Column({
        type: "enum",
        enum: ViewType,
        default: ViewType.TEXT
    })
    optionAType: ViewType

    @Column()
    optionB: string;

    @Column({ default: false })
    optionBValue: boolean;

    @Column({
        type: "enum",
        enum: ViewType,
        default: ViewType.TEXT
    })
    optionBType: ViewType

    @Column()
    optionC: string;

    @Column({ default: false })
    optionCValue: boolean;

    @Column({
        type: "enum",
        enum: ViewType,
        default: ViewType.TEXT
    })
    optionCType: ViewType

    @Column()
    optionD: string;

    @Column({ default: false })
    optionDValue: boolean;

    @Column({
        type: "enum",
        enum: ViewType,
        default: ViewType.TEXT
    })
    optionDType: ViewType

    @Column({ default: 0 })
    level: number;

    @ManyToOne(() => SubjectEntity, subject => subject.mcq_questions)
    subject: SubjectEntity;

    @ManyToOne(() => ModuleEntity, module => module.mcq_questions)
    module: ModuleEntity;

    @ManyToOne(() => TopicEntity, topic => topic.mcq_questions)
    topic: TopicEntity;
}