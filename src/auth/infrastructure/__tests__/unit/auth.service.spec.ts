import { EnvConfigModule } from '@/shared/infrastructure/env-config/env-config.module'
import { EnvConfigService } from '@/shared/infrastructure/env-config/env-config.service'
import { ConfigService } from '@nestjs/config'
import { JwtModule, JwtService } from '@nestjs/jwt'
import { Test, TestingModule } from '@nestjs/testing'
import { AuthService } from '../../auth.service'

describe('AuthService unit tests', () => {
  let sut: AuthService
  let module: TestingModule
  let jwtService: JwtService
  let envConfigService: EnvConfigService
  let configService: ConfigService

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [EnvConfigModule, JwtModule],
      providers: [AuthService],
    }).compile()
  })

  beforeEach(() => {
    jwtService = new JwtService({
      global: true,
      secret: 'fake_secret',
      signOptions: { expiresIn: 3600 },
    })

    configService = new ConfigService()
    envConfigService = new EnvConfigService(configService)
    sut = new AuthService(envConfigService, jwtService)
  })

  it('should be defined', () => {
    expect(sut).toBeDefined()
  })

  it('should generate a JWT token', async () => {
    const result = await sut.generateJwt('fakeId')

    expect(Object.keys(result)).toEqual(['accessToken'])
    expect(typeof result.accessToken).toBe('string')
  })

  it('should validate a JWT token', async () => {
    const { accessToken } = await sut.generateJwt('fakeId')

    const result = await sut.validateJwt(accessToken)
    expect(result).not.toBeNull()
    expect(result.sub).toBe('fakeId')

    await expect(sut.validateJwt('invalidToken')).rejects.toThrow(
      new Error('jwt malformed'),
    )

    await expect(
      sut.validateJwt(
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30',
      ),
    ).rejects.toThrow(new Error('invalid signature'))
  })
})
