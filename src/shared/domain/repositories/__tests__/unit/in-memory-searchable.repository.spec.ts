import { Entity } from '@/shared/domain/entities/entity'
import { InMemorySearchableRepository } from '../../in-memory-searchable.repository'
import {
  SearchParams,
  SearchResult,
} from '../../searchable-repository-contracts'

type StubEntityProps = {
  name: string
  price: number
}

class StubEntity extends Entity<StubEntityProps> {}

class StubInMemorySearchableRepository extends InMemorySearchableRepository<StubEntity> {
  sortableFields: string[] = ['name']
  protected async applyFilter(
    items: StubEntity[],
    filter: string | null,
  ): Promise<StubEntity[]> {
    if (!filter) return Promise.resolve(items)

    const filteredItems = items.filter(item =>
      item.props.name.toLowerCase().includes(filter.toLowerCase()),
    )
    return Promise.resolve(filteredItems)
  }
}

describe('InMemorySearchableRepository unit tests', () => {
  let sut: StubInMemorySearchableRepository

  beforeEach(() => {
    sut = new StubInMemorySearchableRepository()
  })

  describe('applyFilter method', () => {
    it('should return all items if no filter is applied', async () => {
      const items = [new StubEntity({ name: 'Item 1', price: 10 })]
      const spyFilterMethod = jest.spyOn(items, 'filter')
      const result = await sut['applyFilter'](items, null)
      expect(result).toStrictEqual(items)
      expect(spyFilterMethod).not.toHaveBeenCalled()
    })

    it('should return filtered items based on the name', async () => {
      const items = [
        new StubEntity({ name: 'Item 1', price: 10 }),
        new StubEntity({ name: 'Item 2', price: 20 }),
      ]
      const spyFilterMethod = jest.spyOn(items, 'filter')
      const result = await sut['applyFilter'](items, 'Item 1')
      expect(result).toStrictEqual([items[0]])
      expect(spyFilterMethod).toHaveBeenCalledTimes(1)
    })
  })

  describe('applySort method', () => {
    it('should not sort items', () => {
      const items = [
        new StubEntity({ name: 'Item 1', price: 10 }),
        new StubEntity({ name: 'Item 2', price: 20 }),
      ]
      let itemSorted = sut['applySort'](items, null, null)
      expect(itemSorted).toStrictEqual(items)

      itemSorted = sut['applySort'](items, 'nonexistent', null)
      expect(itemSorted).toStrictEqual(items)
    })

    it('should sort items', () => {
      const items = [
        new StubEntity({ name: 'Item 1', price: 10 }),
        new StubEntity({ name: 'Item 2', price: 20 }),
      ]
      let itemSorted = sut['applySort'](items, 'name', 'asc')
      expect(itemSorted).toStrictEqual([items[0], items[1]])

      itemSorted = sut['applySort'](items, 'name', 'desc')
      expect(itemSorted).toStrictEqual([items[1], items[0]])
    })
  })

  describe('applyPaginate method', () => {
    it('should paginate items', () => {
      const items = [
        new StubEntity({ name: 'Item 1', price: 10 }),
        new StubEntity({ name: 'Item 2', price: 20 }),
        new StubEntity({ name: 'Item 3', price: 30 }),
        new StubEntity({ name: 'Item 3', price: 20 }),
        new StubEntity({ name: 'Item 4', price: 20 }),
      ]
      let paginatedItems = sut['applyPaginate'](items, 1, 2)
      expect(paginatedItems).toStrictEqual([items[0], items[1]])

      paginatedItems = sut['applyPaginate'](items, 2, 2)
      expect(paginatedItems).toStrictEqual([items[2], items[3]])

      paginatedItems = sut['applyPaginate'](items, 3, 2)
      expect(paginatedItems).toStrictEqual([items[4]])

      paginatedItems = sut['applyPaginate'](items, 4, 2)
      expect(paginatedItems).toStrictEqual([])
    })
  })

  describe('search method', () => {
    it('should apply only pagination when the other params are null', async () => {
      const entity = new StubEntity({ name: 'Item 1', price: 10 })
      const items = Array(16).fill(entity) as StubEntity[]

      sut.items = items

      const params = await sut.search(new SearchParams())
      expect(params).toStrictEqual(
        new SearchResult({
          items: Array(15).fill(entity) as StubEntity[],
          total: 16,
          currentPage: 1,
          perPage: 15,
          sort: null,
          sortDirection: null,
          filter: null,
        }),
      )
    })

    it('should apply only pagination and filter', async () => {
      const items = [
        new StubEntity({ name: 'test', price: 10 }),
        new StubEntity({ name: 'a', price: 20 }),
        new StubEntity({ name: 'TEST', price: 30 }),
        new StubEntity({ name: 'TeSt', price: 40 }),
        new StubEntity({ name: 'Item 5', price: 50 }),
      ]

      sut.items = items

      let params = await sut.search(
        new SearchParams({
          page: 1,
          perPage: 2,
          filter: 'TEST',
        }),
      )
      expect(params).toStrictEqual(
        new SearchResult({
          items: [items[0], items[2]],
          total: 3,
          currentPage: 1,
          perPage: 2,
          sort: null,
          sortDirection: null,
          filter: 'TEST',
        }),
      )

      params = await sut.search(
        new SearchParams({
          page: 2,
          perPage: 2,
          filter: 'TEST',
        }),
      )
      expect(params).toStrictEqual(
        new SearchResult({
          items: [items[3]],
          total: 3,
          currentPage: 2,
          perPage: 2,
          sort: null,
          sortDirection: null,
          filter: 'TEST',
        }),
      )
    })

    it('should apply only pagination and sort', async () => {
      const items = [
        new StubEntity({ name: 'a', price: 10 }),
        new StubEntity({ name: 'b', price: 20 }),
        new StubEntity({ name: 'c', price: 30 }),
        new StubEntity({ name: 'd', price: 40 }),
        new StubEntity({ name: 'e', price: 50 }),
      ]

      sut.items = items

      let params = await sut.search(
        new SearchParams({
          page: 1,
          perPage: 2,
          sort: 'name',
          sortDirection: 'asc',
        }),
      )
      expect(params).toStrictEqual(
        new SearchResult({
          items: [items[0], items[1]],
          total: 5,
          currentPage: 1,
          perPage: 2,
          sort: 'name',
          sortDirection: 'asc',
          filter: null,
        }),
      )

      params = await sut.search(
        new SearchParams({
          page: 2,
          perPage: 2,
          sort: 'name',
          sortDirection: 'desc',
        }),
      )
      expect(params).toStrictEqual(
        new SearchResult({
          items: [items[2], items[1]],
          total: 5,
          currentPage: 2,
          perPage: 2,
          sort: 'name',
          sortDirection: 'desc',
          filter: null,
        }),
      )
    })
  })

  it('should be an instance of InMemorySearchableRepository', () => {
    expect(sut).toBeInstanceOf(InMemorySearchableRepository)
  })
})
