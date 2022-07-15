import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { IngredientEntity } from "./ingredient.entity";


@Entity('recipe')
export class RecipeEntity {

  @CreateDateColumn()
  createdOn: Date;

  @UpdateDateColumn()
  updatedOn: Date; 

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  recipePic: string;

  @OneToMany(() => IngredientEntity, ingredient => ingredient.recipe)
  ingredients: IngredientEntity[];
}