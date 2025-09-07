import { DatabaseModule } from '@/shared/infrastructure/database/database.module'
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { UserPrismaRepository } from '@/users/infrastructure/database/prisma/repositories/user-prisma.repository'
import { PrismaClient } from '@generated/prisma'
import { Test, TestingModule } from '@nestjs/testing'
import { DeleteUserUseCase } from '../../delete-user.usecase'

describe('DeleteUsecase Integration Tests', () => {
  const prismaService = new PrismaClient()
  let sut: DeleteUserUseCase.UseCase
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
    sut = new DeleteUserUseCase.UseCase(repository)
    await prismaService.user.deleteMany()
  })

  afterAll(async () => {
    await module.close()
  })

  it('slould throw an error when user not found', async () => {
    const props: DeleteUserUseCase.Input = {
      id: 'non-existing-id',
    }

    await expect(() => sut.execute(props)).rejects.toThrow(
      new Error('User with id non-existing-id not found'),
    )
  })

  it('should delete a user', async () => {
    const entity = new UserEntity(UserDataBuilder({}))
    const createdUser = await prismaService.user.create({
      data: entity.toJSON(),
    })

    const output = await sut.execute({ id: entity.id })

    expect(output).toBeUndefined()
    const userInDb = await prismaService.user.findUnique({
      where: { id: createdUser.id },
    })
    expect(userInDb).toBeNull()
  })
})
