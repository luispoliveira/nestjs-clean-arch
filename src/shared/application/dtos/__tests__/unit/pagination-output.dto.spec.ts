import { SearchResult } from '@/shared/domain/repositories/searchable-repository-contracts'
import { PaginationOutputMapper } from '../../pagination-output.dto'

describe('PaginationOutputMapper unit test', () => {
  it('should conver a search result to output', () => {
    const result = new SearchResult({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      items: ['fake'] as any,
      total: 1,
      currentPage: 1,
      perPage: 10,
      sort: null,
      sortDirection: null,
      filter: 'fake',
    })

    const sut = PaginationOutputMapper.toOutput(result.items, result)
    expect(sut).toStrictEqual({
      items: result.items,
      total: result.total,
      currentPage: result.currentPage,
      lastPage: result.lastPage,
      perPage: result.perPage,
    })
  })
})
