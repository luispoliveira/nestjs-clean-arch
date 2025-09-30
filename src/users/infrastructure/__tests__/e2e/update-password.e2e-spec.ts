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
import request from 'supertest'
import { UpdatePasswordDto } from '../../dtos/update-password.dto'
import { BcryptjsHashProvider } from '../../providers/hash-provider/bcryptjs-hash.provider'
import { UsersModule } from '../../users.module'

describe('UsersController e2e tests', () => {
  let app: INestApplication
  let module: TestingModule
  let repository: UserRepository.Repository
  let updatePasswordDto: UpdatePasswordDto
  const prismaService = new PrismaClient()
  let entity: UserEntity
  let hashProvider: HashProvider

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
  })

  beforeEach(async () => {
    updatePasswordDto = {
      password: 'password',
      oldPassword: 'oldPassword',
    }
    await prismaService.user.deleteMany()
    entity = new UserEntity(
      UserDataBuilder({
        password: await hashProvider.generateHash('oldPassword'),
      }),
    )
    await repository.insert(entity)
  })

  describe('PATCH /users/:id', () => {
    it('should update a user password', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/users/${entity.id}`)
        .send(updatePasswordDto)
        .expect(200)

      expect(Object.keys(res.body)).toEqual(['data'])

      const user = await repository.findById(entity.id)

      const checkNewPassword = await hashProvider.compareHash(
        updatePasswordDto.password,
        user.password,
      )
      expect(checkNewPassword).toBeTruthy()
    })

    it('should return a error with 422 code when the request is invalid', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/users/${entity.id}`)
        .send({})
        .expect(422)

      expect(res.body.error).toBe('Unprocessable Entity')
      expect(res.body.message).toEqual([
        'oldPassword should not be empty',
        'oldPassword must be a string',
        'password should not be empty',
        'password must be a string',
      ])
    })

    // it('should return a error with 404 code when the user is not found', async () => {
    //   await request(app.getHttpServer())
    //     .patch(`/users/fakeId`)
    //     .send(updatePasswordDto)
    //     .expect(404)
    //     .expect({
    //       statusCode: 404,
    //       error: 'Not Found',
    //       message: 'User with id fakeId not found',
    //     })
    // })
  })
})
