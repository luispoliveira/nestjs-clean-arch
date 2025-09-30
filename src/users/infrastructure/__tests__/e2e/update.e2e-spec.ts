/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { applyGlobalConfig } from '@/global-config'
import { HashProvider } from '@/shared/application/providers/hash.provider'
import { DatabaseModule } from '@/shared/infrastructure/database/database.module'
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests'
import { EnvConfigModule } from '@/shared/infrastructure/env-config/env-config.module'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserRepository } from '@/users/domain/repositories/user.repository'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { PrismaClient } from '@generated/prisma'
import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { instanceToPlain } from 'class-transformer'
import request from 'supertest'
import { UpdateUserDto } from '../../dtos/update-user.dto'
import { BcryptjsHashProvider } from '../../providers/hash-provider/bcryptjs-hash.provider'
import { UsersController } from '../../users.controller'
import { UsersModule } from '../../users.module'

describe('UsersController e2e tests', () => {
  let app: INestApplication
  let module: TestingModule
  let repository: UserRepository.Repository
  let updateUserDto: UpdateUserDto
  const prismaService = new PrismaClient()
  let entity: UserEntity
  let hashProvider: HashProvider
  let hashPassword: string
  let accessToken: string

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

    hashProvider = new BcryptjsHashProvider()
    hashPassword = await hashProvider.generateHash('123456')
  })

  beforeEach(async () => {
    updateUserDto = {
      name: 'Test User',
    }
    await prismaService.user.deleteMany()
    entity = new UserEntity(
      UserDataBuilder({
        email: 'a@a.com',
        password: hashPassword,
      }),
    )
    await repository.insert(entity)

    const loginResponse = await request(app.getHttpServer())
      .post('/users/login')
      .send({ email: 'a@a.com', password: '123456' })

    accessToken = loginResponse.body.accessToken as string
  })

  describe('PUT /users/:id', () => {
    it('should update a user', async () => {
      updateUserDto.name = 'Updated Name'

      const res = await request(app.getHttpServer())
        .put(`/users/${entity.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateUserDto)
        .expect(200)

      const user = await repository.findById(entity.id)
      const presenter = UsersController.userToResponse(user.toJSON())
      const serialized = instanceToPlain(presenter)

      expect(res.body.data).toEqual(serialized)
    })

    it('should return a error with 422 code when the request is invalid', async () => {
      const res = await request(app.getHttpServer())
        .put(`/users/${entity.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({})
        .expect(422)

      expect(res.body.error).toBe('Unprocessable Entity')
      expect(res.body.message).toEqual([
        'name should not be empty',
        'name must be a string',
      ])
    })

    it('should return a error with 404 code when the user is not found', async () => {
      await request(app.getHttpServer())
        .put(`/users/fakeId`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateUserDto)
        .expect(404)
        .expect({
          statusCode: 404,
          error: 'Not Found',
          message: 'User with id fakeId not found',
        })
    })

    it('should return 401 when no token is provided', async () => {
      await request(app.getHttpServer())
        .put(`/users/${entity.id}`)
        .send(updateUserDto)
        .expect(401)
        .expect({
          statusCode: 401,
          error: 'Unauthorized',
          message: 'No token provided',
        })
    })
  })
})
