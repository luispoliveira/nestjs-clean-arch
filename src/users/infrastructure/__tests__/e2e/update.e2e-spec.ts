/* eslint-disable @typescript-eslint/no-unsafe-member-access */
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
import { instanceToPlain } from 'class-transformer'
import request from 'supertest'
import { UpdateUserDto } from '../../dtos/update-user.dto'
import { UsersController } from '../../users.controller'
import { UsersModule } from '../../users.module'

describe('UsersController e2e tests', () => {
  let app: INestApplication
  let module: TestingModule
  let repository: UserRepository.Repository
  let updateUserDto: UpdateUserDto
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
    updateUserDto = {
      name: 'Test User',
    }
    await prismaService.user.deleteMany()
    entity = new UserEntity(UserDataBuilder({}))
    await repository.insert(entity)
  })

  describe('PUT /users/:id', () => {
    it('should update a user', async () => {
      updateUserDto.name = 'Updated Name'

      const res = await request(app.getHttpServer())
        .put(`/users/${entity.id}`)
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
        .send(updateUserDto)
        .expect(404)
        .expect({
          statusCode: 404,
          error: 'Not Found',
          message: 'User with id fakeId not found',
        })
    })

    // it('should return a error with 422 code when the email field is invalid', async () => {
    //   const { email, ...signUpDtoWithoutEmail } = signUpDto
    //   const res = await request(app.getHttpServer())
    //     .post('/users')
    //     .send({ ...signUpDtoWithoutEmail })
    //     .expect(422)

    //   expect(res.body.error).toBe('Unprocessable Entity')
    //   expect(res.body.message).toEqual([
    //     'email must be an email',
    //     'email should not be empty',
    //     'email must be a string',
    //   ])
    // })

    // it('should return a error with 422 code when the password field is invalid', async () => {
    //   const { password, ...signUpDtoWithoutPassword } = signUpDto
    //   const res = await request(app.getHttpServer())
    //     .post('/users')
    //     .send({ ...signUpDtoWithoutPassword })
    //     .expect(422)

    //   expect(res.body.error).toBe('Unprocessable Entity')
    //   expect(res.body.message).toEqual([
    //     'password should not be empty',
    //     'password must be a string',
    //   ])
    // })

    // it('should return a error with 422 code with invalid field provided', async () => {
    //   const res = await request(app.getHttpServer())
    //     .post('/users')
    //     .send(Object.assign(signUpDto, { xpto: 'fake' }))
    //     .expect(422)
    //   expect(res.body.error).toBe('Unprocessable Entity')
    //   expect(res.body.message).toEqual(['property xpto should not exist'])
    // })

    // it('should return a error with 409 code when email is already taken', async () => {
    //   const entity = new UserEntity(UserDataBuilder({ ...signUpDto }))
    //   await repository.insert(entity)

    //   const res = await request(app.getHttpServer())
    //     .post('/users')
    //     .send(signUpDto)
    //     .expect(409)
    //     .expect({
    //       statusCode: 409,
    //       error: 'Conflict',
    //       message: 'User with email test@example.com already exists',
    //     })
    // })
  })
})
