import { Entity } from '@/shared/domain/entities/entity'
import { InMemorySearchableRepository } from '../../in-memory-searchable.repository'

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

  describe('search method', () => {})

  it('should be an instance of InMemorySearchableRepository', () => {
    expect(sut).toBeInstanceOf(InMemorySearchableRepository)
  })
})
