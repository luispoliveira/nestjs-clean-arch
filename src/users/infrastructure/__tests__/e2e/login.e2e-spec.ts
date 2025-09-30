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
import request from 'supertest'
import { SignInDto } from '../../dtos/sign-in.dto'
import { BcryptjsHashProvider } from '../../providers/hash-provider/bcryptjs-hash.provider'
import { UsersModule } from '../../users.module'

describe('UsersController e2e tests', () => {
  let app: INestApplication
  let module: TestingModule
  let repository: UserRepository.Repository
  let signInDto: SignInDto
  let hashProvider: HashProvider
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
    hashProvider = new BcryptjsHashProvider()
  })

  beforeEach(async () => {
    signInDto = {
      email: 'test@example.com',
      password: 'password',
    }
    await prismaService.user.deleteMany()
  })

  describe('POST /users/login', () => {
    it('should authenticate a user', async () => {
      const hashedPassword = await hashProvider.generateHash(signInDto.password)
      const entity = new UserEntity({
        ...UserDataBuilder({}),
        email: signInDto.email,
        password: hashedPassword,
      })
      await repository.insert(entity)

      const res = await request(app.getHttpServer())
        .post('/users/login')
        .send({
          ...signInDto,
        })
        .expect(200)

      expect(Object.keys(res.body)).toStrictEqual(['accessToken'])
      expect(typeof res.body.accessToken).toBe('string')
    })

    it('should return a 422 if body is invalid', async () => {
      await request(app.getHttpServer())
        .post('/users/login')
        .send({})
        .expect(422)
        .expect({
          statusCode: 422,
          message: [
            'email must be an email',
            'email must be a string',
            'password should not be empty',
            'password must be a string',
          ],
          error: 'Unprocessable Entity',
        })
    })
  })

  it('should return a 404 if user is not found', async () => {
    await request(app.getHttpServer())
      .post('/users/login')
      .send({
        ...signInDto,
      })
      .expect(404)
      .expect({
        statusCode: 404,
        message: 'User with email test@example.com not found',
        error: 'Not Found',
      })
  })

  it('should return a 422 if email is not provided', async () => {
    await request(app.getHttpServer())
      .post('/users/login')
      .send({
        password: signInDto.password,
      })
      .expect(422)
      .expect({
        statusCode: 422,
        message: ['email must be an email', 'email must be a string'],
        error: 'Unprocessable Entity',
      })
  })

  it('should return a 422 if password is not provided', async () => {
    await request(app.getHttpServer())
      .post('/users/login')
      .send({
        email: signInDto.email,
      })
      .expect(422)
      .expect({
        statusCode: 422,
        message: ['password should not be empty', 'password must be a string'],
        error: 'Unprocessable Entity',
      })
  })

  it('should return a 401 if password does not match', async () => {
    const hashedPassword = await hashProvider.generateHash(signInDto.password)
    const entity = new UserEntity({
      ...UserDataBuilder({}),
      email: signInDto.email,
      password: hashedPassword,
    })
    await repository.insert(entity)

    await request(app.getHttpServer())
      .post('/users/login')
      .send({
        ...signInDto,
        password: 'wrongPassword',
      })
      .expect(400)
      .expect({
        statusCode: 400,
        message: 'Invalid email or password.',
        error: 'Bad Request',
      })
  })
})
