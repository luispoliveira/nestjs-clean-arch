import { applyGlobalConfig } from '@/global-config'
import { DatabaseModule } from '@/shared/infrastructure/database/database.module'
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests'
import { EnvConfigModule } from '@/shared/infrastructure/env-config/env-config.module'
import { UserRepository } from '@/users/domain/repositories/user.repository'
import { PrismaClient } from '@generated/prisma'
import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import request from 'supertest'
import { SignUpDto } from '../../dtos/sign-up.dto'
import { UsersModule } from '../../users.module'

describe('UsersController e2e tests', () => {
  let app: INestApplication
  let module: TestingModule
  let repository: UserRepository.Repository
  let signUpDto: SignUpDto
  const prismaService = new PrismaClient()

  beforeAll(async () => {
    setupPrismaTests()
    module = await Test.createTestingModule({
      imports: [
        EnvConfigModule,
        UsersModule,
        DatabaseModule.forTest(prismaService),
      ],
    }).compile()
    app = module.createNestApplication()
    applyGlobalConfig(app)
    await app.init()
    repository = module.get<UserRepository.Repository>('UserRepository')
  })

  beforeEach(async () => {
    signUpDto = {
      email: 'test@example.com',
      password: 'password',
      name: 'Test User',
    }
    await prismaService.user.deleteMany()
  })

  describe('POST /users', () => {
    it('should create a user', async () => {
      const res = await request(app.getHttpServer())
        .post('/users')
        .send(signUpDto)
        .expect(201)

      expect(Object.keys(res.body)).toEqual(['data'])

      const userInDb = await repository.findById(res.body.data.id)
      expect(userInDb).not.toBeNull()
      expect(userInDb?.email).toBe(signUpDto.email)
      expect(userInDb?.name).toBe(signUpDto.name)
      expect(userInDb?.password).not.toBe(signUpDto.password) // Password should be hashed
    })
  })
})
