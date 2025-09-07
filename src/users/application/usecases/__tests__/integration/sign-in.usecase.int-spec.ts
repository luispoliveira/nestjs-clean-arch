import { BadRequestError } from '@/shared/application/errors/bad-request-error'
import { HashProvider } from '@/shared/application/providers/hash.provider'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { DatabaseModule } from '@/shared/infrastructure/database/database.module'
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { UserPrismaRepository } from '@/users/infrastructure/database/prisma/repositories/user-prisma.repository'
import { BcryptjsHashProvider } from '@/users/infrastructure/providers/hash-provider/bcryptjs-hash.provider'
import { PrismaClient } from '@generated/prisma'
import { Test, TestingModule } from '@nestjs/testing'
import { SignInUseCase } from '../../sign-in.usecase'

describe('SignInUsecase Integration Tests', () => {
  const prismaService = new PrismaClient()
  let sut: SignInUseCase.UseCase
  let repository: UserPrismaRepository

  let module: TestingModule
  let hashProvider: HashProvider

  beforeAll(async () => {
    setupPrismaTests()
    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTest(prismaService)],
    }).compile()
    await prismaService.$connect()
    repository = new UserPrismaRepository(prismaService as any)
    hashProvider = new BcryptjsHashProvider()
  })

  beforeEach(async () => {
    sut = new SignInUseCase.UseCase(repository, hashProvider)
    await prismaService.user.deleteMany()
  })

  afterAll(async () => {
    await module.close()
  })

  it('should be able to authenticate', async () => {
    const password = await hashProvider.generateHash('1234')
    const entity = new UserEntity(UserDataBuilder({ password }))
    await prismaService.user.create({ data: entity.toJSON() })

    const output = await sut.execute({
      email: entity.email,
      password: '1234',
    })

    expect(output).toEqual({
      id: entity.id,
      name: entity.name,
      email: entity.email,
      createdAt: entity.createdAt,
      password: entity.password,
    })
  })

  it('should not be able to authenticate with invalid credentials', async () => {
    const entity = new UserEntity(UserDataBuilder({ password: '1234' }))
    await expect(() =>
      sut.execute({ email: entity.email, password: '1234' }),
    ).rejects.toThrow(NotFoundError)

    await prismaService.user.create({ data: entity.toJSON() })

    await expect(() =>
      sut.execute({ email: entity.email, password: 'wrong-password' }),
    ).rejects.toThrow(new Error('Invalid email or password.'))
  })

  it('should throw error when email is empty', async () => {
    await expect(() =>
      sut.execute({ email: '', password: 'password' }),
    ).rejects.toThrow(new BadRequestError('Email and password are required.'))
  })

  it('should throw error when password is empty', async () => {
    await expect(() =>
      sut.execute({ email: 'user@example.com', password: '' }),
    ).rejects.toThrow(new BadRequestError('Email and password are required.'))
  })

  it('should throws error when a entity found by email', async () => {
    await expect(() =>
      sut.execute({
        email: 'non-existing-email@example.com',
        password: 'password',
      }),
    ).rejects.toThrow(
      new NotFoundError(
        `User with email non-existing-email@example.com not found`,
      ),
    )
  })
})
