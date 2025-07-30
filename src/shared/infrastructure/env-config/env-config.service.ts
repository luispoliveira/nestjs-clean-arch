import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { EnvConfig } from './env-config.interface'

@Injectable()
export class EnvConfigService implements EnvConfig {
  constructor(private _configService: ConfigService) {}

  getAppPort(): number {
    return Number(this._configService.get<number>('PORT') || 3000)
  }

  getNodeEnv(): string {
    return this._configService.get<string>('NODE_ENV') || 'development'
  }
}
