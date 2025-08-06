import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserRepository } from '@/users/domain/repositories/user.repository'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { UserInMemoryRepository } from '@/users/infrastructure/database/in-memory/repositories/user-in-memory.repository'
import { ListUsersUseCase } from '../../listusers.usecase'

describe('ListUsersUseCase unit test', () => {
  let sut: ListUsersUseCase.UseCase
  let repository: UserInMemoryRepository

  beforeEach(() => {
    repository = new UserInMemoryRepository()
    sut = new ListUsersUseCase.UseCase(repository)
  })
  it('toOutput method', () => {
    let result = new UserRepository.SearchResult({
      items: [],
      total: 0,
      currentPage: 1,
      perPage: 10,
      sort: null,
      sortDirection: null,
      filter: null,
    })

    let output = sut['toOutput'](result)
    expect(output).toStrictEqual({
      items: [],
      total: 0,
      lastPage: 0,
      currentPage: 1,
      perPage: 10,
    })

    const entity = new UserEntity(UserDataBuilder({}))
    result = new UserRepository.SearchResult({
      items: [entity],
      total: 0,
      currentPage: 1,
      perPage: 10,
      sort: null,
      sortDirection: null,
      filter: null,
    })

    output = sut['toOutput'](result)
    expect(output).toStrictEqual({
      items: [entity.toJSON()],
      total: 0,
      lastPage: 0,
      currentPage: 1,
      perPage: 10,
    })
  })

  it('should return users ordered by createdAt', async () => {
    const createdAt = new Date()
    const items = [
      new UserEntity(UserDataBuilder({ createdAt })),
      new UserEntity(
        UserDataBuilder({ createdAt: new Date(createdAt.getTime() + 1) }),
      ),
    ]

    repository.items = items

    const output = await sut.execute({})
    expect(output).toStrictEqual({
      items: [...items].reverse().map(item => item.toJSON()),
      total: items.length,
      lastPage: 1,
      currentPage: 1,
      perPage: 15,
    })
  })

  it('should return users using pagination, sort, and filter', async () => {
    const items = [
      new UserEntity(UserDataBuilder({ name: 'a' })),
      new UserEntity(UserDataBuilder({ name: 'AA' })),
      new UserEntity(UserDataBuilder({ name: 'Aa' })),
      new UserEntity(UserDataBuilder({ name: 'b' })),
      new UserEntity(UserDataBuilder({ name: 'c' })),
    ]

    repository.items = items

    const output = await sut.execute({
      page: 1,
      perPage: 2,
      sort: 'name',
      sortDirection: 'asc',
      filter: 'a',
    })
    expect(output).toStrictEqual({
      items: [items[1].toJSON(), items[2].toJSON()],
      total: 3,
      lastPage: 2,
      currentPage: 1,
      perPage: 2,
    })
  })
})
