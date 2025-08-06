import { BadRequestError } from '@/shared/application/errors/bad-request-error'
import { InvalidCredentials } from '@/shared/application/errors/invalid-credentials-error'
import { HashProvider } from '@/shared/application/providers/hash.provider'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { UserInMemoryRepository } from '@/users/infrastructure/database/in-memory/repositories/user-in-memory.repository'
import { BcryptjsHashProvider } from '@/users/infrastructure/providers/hash-provider/bcryptjs-hash.provider'
import { SignInUseCase } from '../../sign-in.usecase'

describe('SignInUseCase unit test', () => {
  let sut: SignInUseCase.UseCase
  let repository: UserInMemoryRepository
  let hasProvider: HashProvider

  beforeEach(() => {
    repository = new UserInMemoryRepository()
    hasProvider = new BcryptjsHashProvider()
    sut = new SignInUseCase.UseCase(repository, hasProvider)
  })

  it('should sign in a user successfully', async () => {
    const spyFindByEmail = jest.spyOn(repository, 'findByEmail')
    const password = 'password123'
    const hashedPassword = await hasProvider.generateHash(password)
    const userEntity = new UserEntity(
      UserDataBuilder({ email: 'user@example.com', password: hashedPassword }),
    )

    repository.items = [userEntity]

    const result = await sut.execute({
      email: 'user@example.com',
      password: password,
    })

    expect(result.id).toBeDefined()
    expect(result.createdAt).toBeInstanceOf(Date)
    expect(spyFindByEmail).toHaveBeenCalledTimes(1)
  })

  it('should throw an error if email or password is missing', async () => {
    const props = UserDataBuilder({ email: '', password: '' })

    await expect(
      sut.execute({
        email: props.email,
        password: props.password,
      }),
    ).rejects.toThrow(BadRequestError)
  })

  it('should throw an error if user not found', async () => {
    await expect(
      sut.execute({
        email: 'notfound@example.com',
        password: 'any_password',
      }),
    ).rejects.toThrow(NotFoundError)
  })

  it('should throw an error if password is invalid', async () => {
    const password = 'password123'
    const hashedPassword = await hasProvider.generateHash(password)
    const userEntity = new UserEntity(
      UserDataBuilder({ password: hashedPassword }),
    )

    repository.items = [userEntity]

    await expect(
      sut.execute({
        email: userEntity.email,
        password: 'wrong_password',
      }),
    ).rejects.toThrow(InvalidCredentials)
  })
})
