import { DatabaseModule } from '@/shared/infrastructure/database/database.module'
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { UserPrismaRepository } from '@/users/infrastructure/database/prisma/repositories/user-prisma.repository'
import { PrismaClient } from '@generated/prisma'
import { Test, TestingModule } from '@nestjs/testing'
import { ListUsersUseCase } from '../../list-users.usecase'

describe('ListUsersUsecase Integration Tests', () => {
  const prismaService = new PrismaClient()
  let sut: ListUsersUseCase.UseCase
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
    sut = new ListUsersUseCase.UseCase(repository)
    await prismaService.user.deleteMany()
  })

  afterAll(async () => {
    await module.close()
  })

  it('should return an empty list', async () => {
    const output = await sut.execute({})
    expect(output).toEqual({
      items: [],
      total: 0,
      currentPage: 1,
      perPage: 15,
      lastPage: 0,
    })
  })

  it('should return a list of users ordered by createdAt', async () => {
    const createdAt = new Date()
    const entities: UserEntity[] = []

    const arrange = Array(3).fill(UserDataBuilder({}))

    arrange.forEach((element, index) => {
      entities.push(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        new UserEntity({
          ...element,
          email: `test${index}@mail.com`,
          createdAt: new Date(createdAt.getTime() + index),
        }),
      )
    })

    await prismaService.user.createMany({
      data: entities.map(i => i.toJSON()),
    })

    const output = await sut.execute({})

    expect(output).toStrictEqual({
      items: entities.reverse().map(i => i.toJSON()),
      total: 3,
      currentPage: 1,
      perPage: 15,
      lastPage: 1,
    })
  })

  it('should return output using fitler, orderby and pagination', async () => {
    const createdAt = new Date()
    const entities: UserEntity[] = []

    const arrange = ['test', 'a', 'TEST', 'b', 'TeSt']

    arrange.forEach((element, index) => {
      entities.push(
        new UserEntity({
          ...UserDataBuilder({ name: element }),
          createdAt: new Date(createdAt.getTime() + index),
        }),
      )
    })

    await prismaService.user.createMany({
      data: entities.map(i => i.toJSON()),
    })

    const output = await sut.execute({
      filter: 'TEST',
      sort: 'name',
      sortDirection: 'asc',
      page: 1,
      perPage: 2,
    })

    expect(output).toMatchObject({
      items: [entities[0].toJSON(), entities[4].toJSON()],
      total: 3,
      currentPage: 1,
      perPage: 2,
      lastPage: 2,
    })
  })
})
