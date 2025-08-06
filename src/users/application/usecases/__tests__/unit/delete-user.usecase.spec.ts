import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { UserInMemoryRepository } from '@/users/infrastructure/database/in-memory/repositories/user-in-memory.repository'
import { DeleteUserUseCase } from '../../delete-user.usecase'

describe('DeleteUserUseCase unit test', () => {
  let sut: DeleteUserUseCase.UseCase
  let repository: UserInMemoryRepository

  beforeEach(() => {
    repository = new UserInMemoryRepository()
    sut = new DeleteUserUseCase.UseCase(repository)
  })

  it('should throw an error when user not found', async () => {
    await expect(sut.execute({ id: 'fake-id' })).rejects.toThrow(NotFoundError)
  })

  it('should delete a user', async () => {
    const user = new UserEntity(UserDataBuilder({}))
    await repository.insert(user)

    expect(repository.items).toHaveLength(1)
    await sut.execute({ id: user.id })
    expect(repository.items).toHaveLength(0)
  })
})
