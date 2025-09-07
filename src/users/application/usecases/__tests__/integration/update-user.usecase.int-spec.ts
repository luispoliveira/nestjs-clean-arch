import { DatabaseModule } from '@/shared/infrastructure/database/database.module'
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { UserPrismaRepository } from '@/users/infrastructure/database/prisma/repositories/user-prisma.repository'
import { PrismaClient } from '@generated/prisma'
import { Test, TestingModule } from '@nestjs/testing'
import { UpdateUserUseCase } from '../../update-user.usecase'

describe('UpdateUserUsecase Integration Tests', () => {
  const prismaService = new PrismaClient()
  let sut: UpdateUserUseCase.UseCase
  let repository: UserPrismaRepository

  let module: TestingModule

  beforeAll(async () => {
    setupPrismaTests()
    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTest(prismaService)],
    }).compile()
    await prismaService.$connect()
    repository = new UserPrismaRepository(prismaService as any)
  })

  beforeEach(async () => {
    sut = new UpdateUserUseCase.UseCase(repository)
    await prismaService.user.deleteMany()
  })

  afterAll(async () => {
    await module.close()
  })

  it('slould throw an error when user not found', async () => {
    const props: UpdateUserUseCase.Input = {
      id: 'non-existing-id',
      name: 'New Name',
    }

    await expect(() => sut.execute(props)).rejects.toThrow(
      new Error('User with id non-existing-id not found'),
    )
  })

  it('should update a user', async () => {
    const entity = new UserEntity(UserDataBuilder({}))

    await prismaService.user.create({
      data: entity.toJSON(),
    })
    const props: UpdateUserUseCase.Input = {
      id: entity.id,
      name: 'New Name',
    }

    const output = await sut.execute(props)

    expect(output).toMatchObject({
      ...entity.toJSON(),
      name: 'New Name',
    })
  })
})
