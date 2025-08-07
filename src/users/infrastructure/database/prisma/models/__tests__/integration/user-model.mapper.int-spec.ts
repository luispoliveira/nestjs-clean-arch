import { ValidationError } from '@/shared/domain/errors/validation-error'
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { PrismaClient, User } from '@generated/prisma'
import { v4 } from 'uuid'
import { UserModelMapper } from '../../user-model.mapper'

describe('UserModelMapper Integration Tests', () => {
  let prismaService: PrismaClient
  let props: any

  beforeAll(async () => {
    setupPrismaTests()
    prismaService = new PrismaClient()
    await prismaService.$connect()
  })

  beforeEach(async () => {
    await prismaService.user.deleteMany()
    props = {
      id: v4(),
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'hashed_password',
      createdAt: new Date(),
    }
  })

  afterAll(async () => {
    await prismaService.$disconnect()
  })

  it('should throw error when user model is invalid', () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const model: User = Object.assign(props, { name: null })
    expect(() => UserModelMapper.toEntity(model)).toThrow(ValidationError)
  })

  it('should map user model to entity', async () => {
    const model: User = await prismaService.user.create({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      data: {
        ...props,
      },
    })
    const sut = UserModelMapper.toEntity(model)
    expect(sut).toBeInstanceOf(UserEntity)
    expect(sut.toJSON()).toStrictEqual(props)
  })
})
