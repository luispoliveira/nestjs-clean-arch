import { NestFactory } from '@nestjs/core'
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { applyGlobalConfig } from './global-config'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  )

  const config = new DocumentBuilder()
    .setTitle('NestJS Clean Architecture')
    .setDescription('The NestJS Clean Architecture API description')
    .setVersion('1.0.0')
    .addBearerAuth({
      description: 'Enter JWT token',
      name: 'Authorization',
      scheme: 'Bearer',
      type: 'http',
      bearerFormat: 'JWT',
      in: 'Header',
    })
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)

  applyGlobalConfig(app)

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0')
}
bootstrap().catch(err => {
  console.error('Error during application bootstrap:', err)
  process.exit(1)
})
