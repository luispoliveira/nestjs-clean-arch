import { InvalidPasswordError } from '@/shared/application/errors/invalid-password-error'
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
import { UpdatePasswordUseCase } from '../../update-password.usecase'

describe('UpdatePasswordUserUsecase Integration Tests', () => {
  const prismaService = new PrismaClient()
  let sut: UpdatePasswordUseCase.UseCase
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
    sut = new UpdatePasswordUseCase.UseCase(repository, hashProvider)
    await prismaService.user.deleteMany()
  })

  afterAll(async () => {
    await module.close()
  })

  it('should throws error when a entity found by email', async () => {
    const entity = new UserEntity(UserDataBuilder({}))

    await expect(() =>
      sut.execute({
        id: entity.id,
        oldPassword: 'wrong-password',
        password: 'new-password',
      }),
    ).rejects.toThrow(new NotFoundError(`User with id ${entity.id} not found`))
  })

  it('should throws error when old password not provided', async () => {
    const entity = new UserEntity(UserDataBuilder({}))

    const newUser = await prismaService.user.create({
      data: entity.toJSON(),
    })

    await expect(() =>
      sut.execute({
        id: newUser.id,
        oldPassword: '',
        password: 'new-password',
      }),
    ).rejects.toThrow(
      new InvalidPasswordError('Old password and new password are required.'),
    )
  })

  it('should throws error when new password not provided', async () => {
    const entity = new UserEntity(UserDataBuilder({}))

    const newUser = await prismaService.user.create({
      data: entity.toJSON(),
    })

    await expect(() =>
      sut.execute({
        id: newUser.id,
        oldPassword: 'old-password',
        password: '',
      }),
    ).rejects.toThrow(
      new InvalidPasswordError('Old password and new password are required.'),
    )
  })

  it('should update a password', async () => {
    const oldPassword = await hashProvider.generateHash('1234')
    const entity = new UserEntity(UserDataBuilder({ password: oldPassword }))

    const newUser = await prismaService.user.create({
      data: entity.toJSON(),
    })

    const output = await sut.execute({
      id: newUser.id,
      oldPassword: '1234',
      password: 'new-password',
    })

    const result = await hashProvider.compareHash(
      'new-password',
      output.password,
    )

    expect(result).toBe(true)

    expect(output).toBeDefined()
    expect(output.id).toBe(newUser.id)
    expect(output.name).toBe(newUser.name)
    expect(output.email).toBe(newUser.email)
    expect(output.createdAt).toStrictEqual(newUser.createdAt)
  })
})
