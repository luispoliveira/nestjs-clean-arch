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

  describe('applySort method', () => {})

  describe('applyPaginate method', () => {})

  describe('search method', () => {})

  it('should be an instance of InMemorySearchableRepository', () => {
    expect(sut).toBeInstanceOf(InMemorySearchableRepository)
  })
})
