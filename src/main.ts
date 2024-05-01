import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

const PORT = parseInt(process.env.PORT, 10) || 2014;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(PORT, () => {
    console.log(`🚀 App listening on port ${PORT}`);
  });
}
bootstrap();
