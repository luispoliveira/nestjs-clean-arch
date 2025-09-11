import { PaginationPresenter } from '@/shared/infrastructure/presenters/pagination.presenter'
import { instanceToPlain } from 'class-transformer'
import { UserCollectionPresenter } from '../../user-collection.presenter'
import { UserPresenter } from '../../user.presenter'

describe('UserCollectionPresenter unit tests', () => {
  const createdAt = new Date()
  const props = {
    id: 'e7b8c9f0-3d6a-4c2a-9f1e-1c2b3a4d5e6f',
    name: 'John Doe',
    email: 'john.doe@example.com',
    createdAt,
    password: 'hashed_password',
  }

  describe('constructor', () => {
    it('should set values', () => {
      const sut = new UserCollectionPresenter({
        items: [props],
        currentPage: 1,
        perPage: 2,
        total: 1,
        lastPage: 1,
      })
      expect(sut.meta).toBeInstanceOf(PaginationPresenter)
      expect(sut.meta).toStrictEqual(
        new PaginationPresenter({
          currentPage: 1,
          perPage: 2,
          total: 1,
          lastPage: 1,
        }),
      )
      expect(sut.data).toHaveLength(1)
      expect(sut.data).toStrictEqual([new UserPresenter(props)])
    })
  })
  it('should presenter data', () => {
    const sut = new UserCollectionPresenter({
      items: [props],
      currentPage: 1,
      perPage: 2,
      total: 1,
      lastPage: 1,
    })
    const output = instanceToPlain(sut)
    expect(output).toStrictEqual({
      data: [
        {
          id: 'e7b8c9f0-3d6a-4c2a-9f1e-1c2b3a4d5e6f',
          name: 'John Doe',
          email: 'john.doe@example.com',
          createdAt: createdAt.toISOString(),
        },
      ],
      meta: {
        currentPage: 1,
        perPage: 2,
        total: 1,
        lastPage: 1,
      },
    })
  })
})
