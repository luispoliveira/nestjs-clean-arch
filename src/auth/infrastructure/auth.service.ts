import { EnvConfigService } from '@/shared/infrastructure/env-config/env-config.service'
import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

type GeneratedJwtProps = {
  accessToken: string
}

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: EnvConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async generateJwt(userId: string): Promise<GeneratedJwtProps> {
    const payload = { sub: userId }
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.getJwtSecret(),
      expiresIn: this.configService.getJwtExpiresInSeconds(),
    })
    return { accessToken }
  }

  async validateJwt(token: string): Promise<any> {
    return await this.jwtService.verifyAsync(token, {
      secret: this.configService.getJwtSecret(),
    })
  }
}
