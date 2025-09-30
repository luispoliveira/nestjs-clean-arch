import { InvalidCredentialsError } from '@/shared/application/errors/invalid-credentials-error'
import { Controller, Get, INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import request from 'supertest'
import { InvalidCredentialsErrorFilter } from '../../invalid-credentials-error.filter'
@Controller('stub')
class StubController {
  @Get()
  index() {
    throw new InvalidCredentialsError('Invalid credentials')
  }
}

describe('InvalidCredentialsErrorFilter (e2e)', () => {
  let app: INestApplication
  let module: TestingModule

  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [StubController],
    }).compile()
    app = module.createNestApplication()
    app.useGlobalFilters(new InvalidCredentialsErrorFilter())
    await app.init()
  })

  afterAll(async () => {
    await module.close()
  })

  it('should be defined', () => {
    expect(new InvalidCredentialsErrorFilter()).toBeDefined()
  })

  it('should return a invalid credentials error response', async () => {
    return request(app.getHttpServer()).get('/stub').expect(400).expect({
      statusCode: 400,
      message: 'Invalid credentials',
      error: 'Bad Request',
    })
  })
})
