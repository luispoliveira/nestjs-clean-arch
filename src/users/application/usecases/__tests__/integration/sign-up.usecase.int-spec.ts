import { HashProvider } from '@/shared/application/providers/hash.provider'
import { DatabaseModule } from '@/shared/infrastructure/database/database.module'
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests'
import { UserPrismaRepository } from '@/users/infrastructure/database/prisma/repositories/user-prisma.repository'
import { BcryptjsHashProvider } from '@/users/infrastructure/providers/hash-provider/bcryptjs-hash.provider'
import { PrismaClient } from '@generated/prisma'
import { Test, TestingModule } from '@nestjs/testing'
import { SignUpUseCase } from '../../sign-up.usecase'

describe('SignUpUsecase Integration Tests', () => {
  const prismaService = new PrismaClient()
  let sut: SignUpUseCase.UseCase
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
    sut = new SignUpUseCase.UseCase(repository, hashProvider)
    await prismaService.user.deleteMany()
  })

  afterAll(async () => {
    await module.close()
  })

  it('should create a new user', async () => {
    const props: SignUpUseCase.Input = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password',
    }
    const output = await sut.execute(props)

    expect(output).toBeDefined()
    expect(output.id).toBeDefined()
    expect(output.name).toBe(props.name)
    expect(output.email).toBe(props.email)
    expect(output.createdAt).toBeInstanceOf(Date)
  })
})
