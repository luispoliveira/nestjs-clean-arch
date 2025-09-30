import { Module } from '@nestjs/common'
import { DatabaseModule } from './shared/infrastructure/database/database.module'
import { EnvConfigModule } from './shared/infrastructure/env-config/env-config.module'
import { UsersModule } from './users/infrastructure/users.module'
import { AuthModule } from './auth/infrastructure/auth/auth.module';

@Module({
  imports: [EnvConfigModule, UsersModule, DatabaseModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
