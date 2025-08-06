import { BadRequestError } from '@/shared/application/errors/bad-request-error'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { UserInMemoryRepository } from '@/users/infrastructure/database/in-memory/repositories/user-in-memory.repository'
import { UpdateUserUseCase } from '../../update-user.usecase'

describe('UpdateUserUseCase unit test', () => {
  let sut: UpdateUserUseCase.UseCase
  let repository: UserInMemoryRepository

  beforeEach(() => {
    repository = new UserInMemoryRepository()
    sut = new UpdateUserUseCase.UseCase(repository)
  })

  it('should throw an error when user not found', async () => {
    await expect(sut.execute({ id: 'fake-id', name: 'test' })).rejects.toThrow(
      NotFoundError,
    )
  })

  it('should throw an error when name is not provided', async () => {
    await expect(sut.execute({ id: '1', name: '' })).rejects.toThrow(
      BadRequestError,
    )
  })

  it('should update a user', async () => {
    const spyUpdate = jest.spyOn(repository, 'update')
    const items = [new UserEntity(UserDataBuilder({}))]

    repository.items = items

    const result = await sut.execute({ id: items[0].id, name: 'updated' })
    expect(result).toEqual({
      id: items[0].id,
      name: 'updated',
      email: items[0].email,
      password: items[0].password,
      createdAt: items[0].createdAt,
    })
    expect(spyUpdate).toHaveBeenCalledTimes(1)
  })
})
