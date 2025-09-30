import { InvalidPasswordError } from '@/shared/application/errors/invalid-password-error'
import { Controller, Get, INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import request from 'supertest'
import { InvalidPasswordErrorFilter } from '../../invalid-password-error.filter'

@Controller('stub')
class StubController {
  @Get()
  index() {
    throw new InvalidPasswordError('Invalid password error example')
  }
}
describe('InvalidPasswordErrorFilter', () => {
  let app: INestApplication
  let module: TestingModule

  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [StubController],
    }).compile()
    app = module.createNestApplication()
    app.useGlobalFilters(new InvalidPasswordErrorFilter())
    await app.init()
  })

  afterAll(async () => {
    await module.close()
  })

  it('should be defined', () => {
    expect(new InvalidPasswordErrorFilter()).toBeDefined()
  })

  it('should return a invalid password error response', () => {
    return request(app.getHttpServer()).get('/stub').expect(422).expect({
      statusCode: 422,
      message: 'Invalid password error example',
      error: 'Unprocessable Entity',
    })
  })
})
