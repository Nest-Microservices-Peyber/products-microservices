/* eslint-disable prettier/prettier */

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { envs } from './config';
import {  MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {

  const logger = new Logger('bootstrap');
  //console.log('**********************',envs.natsServers);

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.NATS,
      options: {
          servers: envs.natsServers
      }
    }
  );

  //app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    })
    );
  //await app.listen(envs.port);
  await app.listen();
  logger.log(`Products Microservices running on port: ${envs.port}`);
}
bootstrap();
