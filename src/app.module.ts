import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { typeOrmConfigAsync } from './config/database.provider';
import { AddressModule } from './modules/address/address.module';
import { AuthModule } from './modules/auth/auth.module';
import { ImageUploadModule } from './modules/imageUpload/ImageUpload.module';
import { InstitutionModule } from './modules/institution/institution.module';
import { ProgrammeModule } from './modules/programme/programme.module';
import { QuestionModule } from './modules/question/question.module';
import { RecipeModule } from './modules/recipe/recipe.module';
import { StudentClassModule } from './modules/student_class/student_class.module';
import { SubjectModule } from './modules/subject/subject.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync(typeOrmConfigAsync),
    AuthModule,
    UserModule,
    AddressModule,
    InstitutionModule,
    StudentClassModule,
    ProgrammeModule,
    SubjectModule,
    QuestionModule,
    RecipeModule,
    ImageUploadModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private readonly connection: Connection) {}
}
