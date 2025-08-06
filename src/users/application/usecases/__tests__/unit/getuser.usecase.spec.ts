import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { UserInMemoryRepository } from '@/users/infrastructure/database/in-memory/repositories/user-in-memory.repository'
import { GetUserUseCase } from '../../getuser.usecase'

describe('GetUserUseCase unit test', () => {
  let sut: GetUserUseCase.UseCase
  let repository: UserInMemoryRepository

  beforeEach(() => {
    repository = new UserInMemoryRepository()
    sut = new GetUserUseCase.UseCase(repository)
  })

  it('should throw an error when user not found', async () => {
    await expect(sut.execute({ id: 'fake-id' })).rejects.toThrow(NotFoundError)
  })

  it('should return a user when found', async () => {
    const spyFindById = jest.spyOn(repository, 'findById')
    const user = new UserEntity(UserDataBuilder({}))
    await repository.insert(user)

    const result = await sut.execute({ id: user.id })
    expect(result).toStrictEqual(user.toJSON())
    expect(spyFindById).toHaveBeenCalledTimes(1)
  })

  it('should return a user with correct properties', async () => {
    const user = new UserEntity(
      UserDataBuilder({ name: 'John Doe', email: 'john.doe@example.com' }),
    )
    await repository.insert(user)
    const result = await sut.execute({ id: user.id })
    expect(result).toStrictEqual(user.toJSON())
    expect(result.name).toBe('John Doe')
    expect(result.email).toBe('john.doe@example.com')
    expect(result.id).toBe(user.id)
    expect(result.createdAt).toBeInstanceOf(Date)
  })
})
