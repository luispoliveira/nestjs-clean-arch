import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { EnvConfigModule } from '../env-config/env-config.module'
import { PrismaService } from './prisma/prisma.service'

@Module({
  imports: [EnvConfigModule.forRoot()],
  providers: [ConfigService, PrismaService],
  exports: [PrismaService],
})
export class DatabaseModule {}
