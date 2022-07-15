import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { RecipeEntity } from "./recipe.entity";


@Entity('ingredient')
export class IngredientEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  amount: string;

  @ManyToOne(() => RecipeEntity, recipe => recipe.ingredients,
  { orphanedRowAction: 'delete' }
  )
  recipe: RecipeEntity;

}