import { BadRequestError } from '@/shared/application/errors/bad-request-error'
import { HashProvider } from '@/shared/application/providers/hash.provider'
import { ConflictError } from '@/shared/domain/errors/conflict-error'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { UserInMemoryRepository } from '@/users/infrastructure/database/in-memory/repositories/user-in-memory.repository'
import { BcryptjsHashProvider } from '@/users/infrastructure/providers/hash-provider/bcryptjs-hash.provider'
import { SignupUseCase } from '../../signup.usecase'

describe('SignupUseCase unit test', () => {
  let sut: SignupUseCase.UseCase
  let repository: UserInMemoryRepository
  let hasProvider: HashProvider

  beforeEach(() => {
    repository = new UserInMemoryRepository()
    hasProvider = new BcryptjsHashProvider()
    sut = new SignupUseCase.UseCase(repository, hasProvider)
  })

  it('should sign up a user successfully', async () => {
    const spyInsert = jest.spyOn(repository, 'insert')
    const props = UserDataBuilder({})

    const result = await sut.execute({
      name: props.name,
      email: props.email,
      password: props.password,
    })

    expect(result.id).toBeDefined()
    expect(result.createdAt).toBeInstanceOf(Date)
    expect(spyInsert).toHaveBeenCalledTimes(1)
  })

  it('should throw an error if name, email, or password is missing', async () => {
    let props = UserDataBuilder({ email: '' })

    await expect(
      sut.execute({
        name: props.name,
        email: props.email,
        password: props.password,
      }),
    ).rejects.toThrow(BadRequestError)

    props = UserDataBuilder({ name: '' })
    await expect(
      sut.execute({
        name: props.name,
        email: props.email,
        password: props.password,
      }),
    ).rejects.toThrow(BadRequestError)

    props = UserDataBuilder({ password: '' })
    await expect(
      sut.execute({
        name: props.name,
        email: props.email,
        password: props.password,
      }),
    ).rejects.toThrow(BadRequestError)
  })

  it('should throw an error if email already exists', async () => {
    const props = UserDataBuilder({ email: 'john@example.com' })

    await sut.execute({
      name: props.name,
      email: props.email,
      password: props.password,
    })

    await expect(() => sut.execute(props)).rejects.toBeInstanceOf(ConflictError)
  })
})
