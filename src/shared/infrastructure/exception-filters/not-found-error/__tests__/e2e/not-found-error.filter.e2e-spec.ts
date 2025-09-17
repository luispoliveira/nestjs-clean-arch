import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { Controller, Get, INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import request from 'supertest'
import { NotFoundErrorFilter } from '../../not-found-error.filter'
@Controller('stub')
class StubController {
  @Get()
  index() {
    throw new NotFoundError('NotFound error example')
  }
}
describe('NotFoundErrorFilter (e2e)', () => {
  let app: INestApplication
  let module: TestingModule

  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [StubController],
    }).compile()
    app = module.createNestApplication()
    app.useGlobalFilters(new NotFoundErrorFilter())
    await app.init()
  })

  afterAll(async () => {
    await module.close()
  })

  it('should be defined', () => {
    expect(new NotFoundErrorFilter()).toBeDefined()
  })

  it('should return a not found error response', async () => {
    return request(app.getHttpServer()).get('/stub').expect(404).expect({
      statusCode: 404,
      message: 'NotFound error example',
      error: 'Not Found',
    })
  })
})
