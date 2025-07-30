import { validate as uuidValidate } from 'uuid'
import { Entity } from '../../entity'

type StubProps = {
  prop1: string
  prop2: number
}

class StubEntity extends Entity<StubProps> {}

describe('Entity unit tests', () => {
  it('should create an entity with a valid UUID', () => {
    const props: StubProps = { prop1: 'test', prop2: 123 }
    const entity = new StubEntity(props)

    expect(entity).toBeInstanceOf(StubEntity)
    expect(entity.id).not.toBeNull()
    expect(uuidValidate(entity.id)).toBe(true)
    expect(entity.props).toEqual(props)
  })

  it('should accept a valid uuid', () => {
    const props: StubProps = { prop1: 'test', prop2: 123 }
    const id = '123e4567-e89b-12d3-a456-426614174000'
    const entity = new StubEntity(props, id)

    expect(uuidValidate(entity.id)).toBeTruthy()
  })

  it('should convert a entity to JSON', () => {
    const props: StubProps = { prop1: 'test', prop2: 123 }
    const id = '123e4567-e89b-12d3-a456-426614174000'
    const entity = new StubEntity(props, id)

    expect(entity.toJSON()).toStrictEqual({
      id: entity.id,
      ...props,
    })
  })
})
