import { NestFactory } from '@nestjs/core'
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify'
import { AppModule } from './app.module'
import { applyGlobalConfig } from './global-config'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  )

  applyGlobalConfig(app)

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0')
}
bootstrap().catch(err => {
  console.error('Error during application bootstrap:', err)
  process.exit(1)
})
