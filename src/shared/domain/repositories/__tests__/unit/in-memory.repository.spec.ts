import { Entity } from '@/shared/domain/entities/entity'
import { InMemoryRepository } from '../../in-memory.repository'

type StubEntityProps = {
  name: string
  price: number
}

class StubEntity extends Entity<StubEntityProps> {}

class StubInMemoryRepository extends InMemoryRepository<StubEntity> {}

describe('InMemoryRepository unit tests', () => {
  let sut: StubInMemoryRepository
  beforeEach(() => {
    sut = new StubInMemoryRepository()
  })

  it('should insert an entity', async () => {
    const entity = new StubEntity({ name: 'Test', price: 100 })
    await sut.insert(entity)
    expect(sut.items).toHaveLength(1)
    expect(sut.items[0]).toBe(entity)
  })

  it('should find an entity by id', async () => {
    const entity = new StubEntity({ name: 'Test', price: 100 })
    await sut.insert(entity)
    const foundEntity = await sut.findById(entity.id)
    expect(foundEntity).toBe(entity)
  })

  it('should return all entities', async () => {
    const entity1 = new StubEntity({ name: 'Test1', price: 100 })
    const entity2 = new StubEntity({ name: 'Test2', price: 200 })
    await sut.insert(entity1)
    await sut.insert(entity2)
    const allEntities = await sut.findAll()
    expect(allEntities).toHaveLength(2)
    expect(allEntities).toEqual([entity1, entity2])
  })
})
