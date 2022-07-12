import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as basicAuth from 'express-basic-auth';
import { DocumentBuilder, SwaggerDocumentOptions, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { UserModule } from './modules/user/user.module';
import { InstitutionModule } from './modules/institution/institution.module';
import { AddressModule } from './modules/address/address.module';
import { StudentClassModule } from './modules/student_class/student_class.module';
import { AuthModule } from './modules/auth/auth.module';
import { SubjectModule } from './modules/subject/subject.module';
import { QuestionModule } from './modules/question/question.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  app.use(['/api', '/api-json'], basicAuth({
    challenge: true,
    users: {
      [process.env.SWAGGER_USER]: process.env.SWAGGER_PASSWORD,
    },
  }));
  const config = new DocumentBuilder()
    .setTitle('Student Question Api')
    .setDescription('Api to use for student and examination')
    .setVersion('1.0')
    .build();
  const options: SwaggerDocumentOptions = {
    include: [
      UserModule,
      InstitutionModule,
      AddressModule,
      StudentClassModule,
      AuthModule,
      SubjectModule,
      QuestionModule
    ]
  }
  const document = SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(8000);
  Logger.log(`Server start at 8000`, 'Bootstrap');
}
bootstrap();
