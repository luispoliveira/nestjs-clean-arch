import { DatabaseModule } from '@/shared/infrastructure/database/database.module'
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { UserPrismaRepository } from '@/users/infrastructure/database/prisma/repositories/user-prisma.repository'
import { PrismaClient } from '@generated/prisma'
import { Test, TestingModule } from '@nestjs/testing'
import { GetUserUseCase } from '../../get-user.usecase'

describe('GetUserUsecase Integration Tests', () => {
  const prismaService = new PrismaClient()
  let sut: GetUserUseCase.UseCase
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
    sut = new GetUserUseCase.UseCase(repository)
    await prismaService.user.deleteMany()
  })

  afterAll(async () => {
    await module.close()
  })

  it('slould throw an error when user not found', async () => {
    const props: GetUserUseCase.Input = {
      id: 'non-existing-id',
    }

    await expect(() => sut.execute(props)).rejects.toThrow(
      new Error('User with id non-existing-id not found'),
    )
  })

  it('should return a user', async () => {
    const entity = new UserEntity(UserDataBuilder({}))

    const model = await prismaService.user.create({
      data: entity.toJSON(),
    })

    const props: GetUserUseCase.Input = {
      id: entity.id,
    }

    const output = await sut.execute(props)

    expect(output).toMatchObject(model)
  })
})
