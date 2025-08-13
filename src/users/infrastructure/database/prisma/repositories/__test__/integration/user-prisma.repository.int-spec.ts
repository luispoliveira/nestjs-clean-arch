import { ConflictError } from '@/shared/domain/errors/conflict-error'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { DatabaseModule } from '@/shared/infrastructure/database/database.module'
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserRepository } from '@/users/domain/repositories/user.repository'
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

  describe('findAll', () => {
    it('should return an array of users', async () => {
      let users = await sut.findAll()
      expect(users).toHaveLength(0)

      const entity = new UserEntity(UserDataBuilder({}))
      await sut.insert(entity)

      users = await sut.findAll()
      expect(users).toHaveLength(1)
      expect(users[0]).toBeInstanceOf(UserEntity)
      expect(users[0].toJSON()).toStrictEqual(entity.toJSON())
    })
  })

  describe('search method tests', () => {
    it('should apply only pagination when the other params are null', async () => {
      const createdAt = new Date()
      const entities: UserEntity[] = []
      const arrange = Array(16).fill(UserDataBuilder({}))
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
        data: entities.map(item => item.toJSON()),
      })

      const searchOutput = await sut.search(new UserRepository.SearchParams())
      const items = searchOutput.items

      expect(searchOutput).toBeInstanceOf(UserRepository.SearchResult)
      expect(searchOutput.total).toBe(16)
      expect(searchOutput.items.length).toBe(15)
      searchOutput.items.forEach(item => {
        expect(item).toBeInstanceOf(UserEntity)
      })
      items.reverse().forEach((item, index) => {
        expect(`test${index + 1}@mail.com`).toBe(item.email)
      })
    })

    it('should search using filter, sort and paginate', async () => {
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
        data: entities.map(item => item.toJSON()),
      })

      const searchOutputPage1 = await sut.search(
        new UserRepository.SearchParams({
          page: 1,
          perPage: 2,
          sort: 'name',
          sortDirection: 'asc',
          filter: 'TEST',
        }),
      )

      expect(searchOutputPage1.items[0].toJSON()).toMatchObject(
        entities[0].toJSON(),
      )
      expect(searchOutputPage1.items[1].toJSON()).toMatchObject(
        entities[4].toJSON(),
      )

      const searchOutputPage2 = await sut.search(
        new UserRepository.SearchParams({
          page: 2,
          perPage: 2,
          sort: 'name',
          sortDirection: 'asc',
          filter: 'TEST',
        }),
      )

      expect(searchOutputPage2.items[0].toJSON()).toMatchObject(
        entities[2].toJSON(),
      )
    })
  })

  describe('update method tests', () => {
    it('should update an existing user', async () => {
      const entity = new UserEntity(UserDataBuilder({}))
      await sut.insert(entity)

      entity.update('Updated Name')

      await sut.update(entity)

      const user = await prismaService.user.findUniqueOrThrow({
        where: { id: entity.id },
      })
      expect(user.name).toBe('Updated Name')
    })

    it('should throw error when trying to update a non-existing user', async () => {
      const entity = new UserEntity(UserDataBuilder({}))
      await expect(() => sut.update(entity)).rejects.toThrow(NotFoundError)
    })
  })

  describe('delete method tests', () => {
    it('should delete an existing user', async () => {
      const entity = new UserEntity(UserDataBuilder({}))
      await sut.insert(entity)

      await sut.delete(entity.id)

      const user = await prismaService.user.findUnique({
        where: { id: entity.id },
      })
      expect(user).toBeNull()
    })

    it('should throw error when trying to delete a non-existing user', async () => {
      await expect(() => sut.delete('non-existing-id')).rejects.toThrow(
        NotFoundError,
      )
    })
  })

  describe('emailExists method tests', () => {
    it('should not throw error if email does not exist', () => {
      expect(
        async () => await sut.emailExists('non-existing-email@mail.com'),
      ).not.toThrow()
    })

    it('should throw error if email already exists', async () => {
      const entity = new UserEntity(
        UserDataBuilder({ email: 'existing-email@mail.com' }),
      )
      await sut.insert(entity)

      await expect(() =>
        sut.emailExists('existing-email@mail.com'),
      ).rejects.toThrow(ConflictError)
    })
  })

  describe('findByEmail method tests', () => {
    it('should return a user if email exists', async () => {
      const entity = new UserEntity(
        UserDataBuilder({ email: 'existing-email@mail.com' }),
      )
      await sut.insert(entity)

      const user = await sut.findByEmail('existing-email@mail.com')
      expect(user).toBeInstanceOf(UserEntity)
      expect(user.email).toBe('existing-email@mail.com')
    })

    it('should throw error if email does not exist', async () => {
      await expect(
        async () => await sut.findByEmail('non-existing-email@mail.com'),
      ).rejects.toThrow(NotFoundError)
    })
  })
})
