import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { EnvConfig } from './env-config.interface'

@Injectable()
export class EnvConfigService implements EnvConfig {
  constructor(private _configService: ConfigService) {}

  getJwtSecret(): string {
    return this._configService.get<string>('JWT_SECRET') || 'default_secret'
  }
  getJwtExpiresInSeconds(): number {
    return Number(this._configService.get<string>('JWT_EXPIRES_IN')) || 3600
  }

  getAppPort(): number {
    return Number(this._configService.get<number>('PORT') || 3000)
  }

  getNodeEnv(): string {
    return this._configService.get<string>('NODE_ENV') || 'development'
  }
}
