import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { DatabaseModule } from '@/shared/infrastructure/database/database.module'
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { PrismaClient } from '@generated/prisma'
import { Test, TestingModule } from '@nestjs/testing'
import { UserPrismaRepository } from '../../user-prisma.repository'

describe('UserPrismaRepository Integration Tests', () => {
  const prismaService = new PrismaClient()
  let sut: UserPrismaRepository
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let module: TestingModule

  beforeAll(async () => {
    setupPrismaTests()
    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTest(prismaService)],
    }).compile()
    await prismaService.$connect()
  })

  beforeEach(async () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    sut = new UserPrismaRepository(prismaService as any)
    await prismaService.user.deleteMany()
  })

  it('should throws error when entity not found', async () => {
    await expect(() => sut.findById('dd')).rejects.toThrow(
      new NotFoundError('User with id dd not found'),
    )
  })

  it('should find a existing user by id', async () => {
    const entity = new UserEntity(UserDataBuilder({}))

    const newUser = await prismaService.user.create({
      data: entity.toJSON(),
    })

    const user = await sut.findById(newUser.id)
    expect(user).toBeInstanceOf(UserEntity)
    expect(user.toJSON()).toStrictEqual(newUser)
  })

  it('should insert a new user', async () => {
    const entity = new UserEntity(UserDataBuilder({}))
    await sut.insert(entity)

    const user = await prismaService.user.findUniqueOrThrow({
      where: { id: entity.id },
    })
    expect(user).toBeDefined()
    expect(user.id).toEqual(entity.id)
  })
})
