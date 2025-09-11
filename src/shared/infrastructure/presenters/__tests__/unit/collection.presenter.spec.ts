import { instanceToPlain } from 'class-transformer'
import { CollectionPresenter } from '../../collection.presenter'
import { PaginationPresenter } from '../../pagination.presenter'

class StubCollectionPresenter extends CollectionPresenter {
  data = [1, 2, 3]
}

describe('CollectionPresenter unit test', () => {
  let sut: StubCollectionPresenter

  beforeEach(() => {
    sut = new StubCollectionPresenter({
      currentPage: 1,
      perPage: 2,
      total: 4,
      lastPage: 2,
    })
  })

  describe('constructor', () => {
    it('should set values', () => {
      expect(sut['paginationPresenter']).toBeInstanceOf(PaginationPresenter)
      expect(sut['paginationPresenter']).toMatchObject({
        currentPage: 1,
        perPage: 2,
        total: 4,
        lastPage: 2,
      })
    })
  })

  it('should return meta', () => {
    const output = instanceToPlain(sut)
    expect(output).toMatchObject({
      data: [1, 2, 3],
      meta: {
        currentPage: 1,
        perPage: 2,
        total: 4,
        lastPage: 2,
      },
    })
  })
})
