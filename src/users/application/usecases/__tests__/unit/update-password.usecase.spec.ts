import { InvalidPasswordError } from '@/shared/application/errors/invalid-password-error'
import { HashProvider } from '@/shared/application/providers/hash.provider'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { UserInMemoryRepository } from '@/users/infrastructure/database/in-memory/repositories/user-in-memory.repository'
import { BcryptjsHashProvider } from '@/users/infrastructure/providers/hash-provider/bcryptjs-hash.provider'
import { UpdatePasswordUseCase } from '../../update-password.usecase'

describe('UpdatePasswordUseCase unit test', () => {
  let sut: UpdatePasswordUseCase.UseCase
  let repository: UserInMemoryRepository
  let hashProvider: HashProvider

  beforeEach(() => {
    repository = new UserInMemoryRepository()
    hashProvider = new BcryptjsHashProvider()
    sut = new UpdatePasswordUseCase.UseCase(repository, hashProvider)
  })

  it('should throw an error when user not found', async () => {
    await expect(
      sut.execute({ id: 'fake-id', oldPassword: 'old', password: 'new' }),
    ).rejects.toThrow(new NotFoundError('Entity not found'))
  })

  it('should throw an error when old password or new password is not provided', async () => {
    const entity = new UserEntity(UserDataBuilder({}))
    repository.items = [entity]

    await expect(
      sut.execute({ id: entity.id, oldPassword: '', password: 'new' }),
    ).rejects.toThrow(
      new InvalidPasswordError('Old password and new password are required.'),
    )

    await expect(
      sut.execute({ id: entity.id, oldPassword: 'old', password: '' }),
    ).rejects.toThrow(
      new InvalidPasswordError('Old password and new password are required.'),
    )
  })

  it('should throw an error when old password is incorrect', async () => {
    const hashedPassword = await hashProvider.generateHash('old')
    const entity = new UserEntity(UserDataBuilder({ password: hashedPassword }))
    repository.items = [entity]

    await expect(
      sut.execute({ id: entity.id, oldPassword: 'wrong', password: 'new' }),
    ).rejects.toThrow(new InvalidPasswordError('Old password is incorrect.'))
  })

  it('should update the user password', async () => {
    const hashedPassword = await hashProvider.generateHash('old')
    const spyUpdate = jest.spyOn(repository, 'update')
    const entity = new UserEntity(UserDataBuilder({ password: hashedPassword }))
    repository.items = [entity]

    const result = await sut.execute({
      id: entity.id,
      oldPassword: 'old',
      password: 'new',
    })

    const checkNewPassword = await hashProvider.compareHash(
      'new',
      result.password,
    )

    expect(spyUpdate).toHaveBeenCalledTimes(1)
    expect(checkNewPassword).toBeTruthy()
  })
})
