/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
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

    it('should return a error with 422 code when the request is invalid', async () => {
      const res = await request(app.getHttpServer())
        .post('/users')
        .send({})
        .expect(422)

      expect(res.body.error).toBe('Unprocessable Entity')
      expect(res.body.message).toEqual([
        'name should not be empty',
        'name must be a string',
        'email must be an email',
        'email should not be empty',
        'email must be a string',
        'password should not be empty',
        'password must be a string',
      ])
    })

    it('should return a error with 422 code when the name field is invalid', async () => {
      const { name, ...signUpDtoWithoutName } = signUpDto
      const res = await request(app.getHttpServer())
        .post('/users')
        .send({ ...signUpDtoWithoutName })
        .expect(422)

      expect(res.body.error).toBe('Unprocessable Entity')
      expect(res.body.message).toEqual([
        'name should not be empty',
        'name must be a string',
      ])
    })

    it('should return a error with 422 code when the email field is invalid', async () => {
      const { email, ...signUpDtoWithoutEmail } = signUpDto
      const res = await request(app.getHttpServer())
        .post('/users')
        .send({ ...signUpDtoWithoutEmail })
        .expect(422)

      expect(res.body.error).toBe('Unprocessable Entity')
      expect(res.body.message).toEqual([
        'email must be an email',
        'email should not be empty',
        'email must be a string',
      ])
    })

    it('should return a error with 422 code when the password field is invalid', async () => {
      const { password, ...signUpDtoWithoutPassword } = signUpDto
      const res = await request(app.getHttpServer())
        .post('/users')
        .send({ ...signUpDtoWithoutPassword })
        .expect(422)

      expect(res.body.error).toBe('Unprocessable Entity')
      expect(res.body.message).toEqual([
        'password should not be empty',
        'password must be a string',
      ])
    })

    it('should return a error with 422 code with invalid field provided', async () => {
      const res = await request(app.getHttpServer())
        .post('/users')
        .send(Object.assign(signUpDto, { xpto: 'fake' }))
        .expect(422)
      expect(res.body.error).toBe('Unprocessable Entity')
      expect(res.body.message).toEqual(['property xpto should not exist'])
    })
  })
})
