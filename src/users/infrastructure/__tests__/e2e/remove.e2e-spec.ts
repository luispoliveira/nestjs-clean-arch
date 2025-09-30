/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { applyGlobalConfig } from '@/global-config'
import { DatabaseModule } from '@/shared/infrastructure/database/database.module'
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests'
import { EnvConfigModule } from '@/shared/infrastructure/env-config/env-config.module'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserRepository } from '@/users/domain/repositories/user.repository'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { PrismaClient } from '@generated/prisma'
import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import request from 'supertest'
import { UsersModule } from '../../users.module'

describe('UsersController e2e tests', () => {
  let app: INestApplication
  let module: TestingModule
  let repository: UserRepository.Repository
  const prismaService = new PrismaClient()
  let entity: UserEntity

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
    await prismaService.user.deleteMany()
    entity = new UserEntity(UserDataBuilder({}))
    await repository.insert(entity)
  })

  describe('REMOVE /users/:id', () => {
    it('should remove a user', async () => {
      await request(app.getHttpServer())
        .delete(`/users/${entity.id}`)
        .expect(204)
        .expect({})
    })

    it('should return a error with 404 code when the user is not found', async () => {
      await request(app.getHttpServer())
        .get(`/users/fakeId`)
        .expect(404)
        .expect({
          statusCode: 404,
          error: 'Not Found',
          message: 'User with id fakeId not found',
        })
    })
  })
})
