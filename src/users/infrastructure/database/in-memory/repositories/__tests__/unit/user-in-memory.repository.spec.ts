import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { UserInMemoryRepository } from '../../user-in-memory.repository'

describe('UserInMemoryRepository unit tests', () => {
  let sut: UserInMemoryRepository

  beforeEach(() => {
    sut = new UserInMemoryRepository()
  })

  it('should throw NotFoundError when findByEmail is called with non-existing email', async () => {
    await expect(
      sut.findByEmail('non-existing-email@example.com'),
    ).rejects.toThrow(
      `User with email non-existing-email@example.com not found`,
    )
  })

  it('should return user when findByEmail is called with existing email', async () => {
    const user = new UserEntity(UserDataBuilder({}))
    await sut.insert(user)
    const foundUser = await sut.findByEmail(user.email)
    expect(foundUser.toJSON()).toStrictEqual(user.toJSON())
  })

  it('should throw ConflictError when emailExists is called with existing email', async () => {
    const user = new UserEntity(UserDataBuilder({}))
    await sut.insert(user)
    await expect(sut.emailExists(user.email)).rejects.toThrow(
      `User with email ${user.email} already exists`,
    )
  })

  it('should not throw ConflictError when emailExists is called with non-existing email', async () => {
    await expect(
      sut.emailExists('non-existing-email@example.com'),
    ).resolves.toBeFalsy()
  })

  it('should not filter items when object is null', async () => {
    const entity = new UserEntity(UserDataBuilder({}))
    await sut.insert(entity)

    const result = await sut.findAll()
    const spyFilter = jest.spyOn(result, 'filter')

    const itemsFiltered = await sut['applyFilter'](result, null)
    expect(itemsFiltered).toHaveLength(1)
    expect(spyFilter).not.toHaveBeenCalled()
    expect(itemsFiltered[0].toJSON()).toStrictEqual(entity.toJSON())
  })

  it('should filter items by name', async () => {
    const entity1 = new UserEntity(UserDataBuilder({ name: 'John Doe' }))
    const entity2 = new UserEntity(UserDataBuilder({ name: 'Jane Doe' }))
    await sut.insert(entity1)
    await sut.insert(entity2)
    const result = await sut.findAll()

    const spyFilter = jest.spyOn(result, 'filter')
    const itemsFiltered = await sut['applyFilter'](result, 'John')
    expect(itemsFiltered).toHaveLength(1)
    expect(spyFilter).toHaveBeenCalled()
    expect(itemsFiltered[0].toJSON()).toStrictEqual(entity1.toJSON())
  })

  it('should sort items by createdAt when no sort is provided', async () => {
    const entity1 = new UserEntity(
      UserDataBuilder({ createdAt: new Date(2023, 0, 1) }),
    )
    const entity2 = new UserEntity(
      UserDataBuilder({ createdAt: new Date(2023, 0, 2) }),
    )
    await sut.insert(entity1)
    await sut.insert(entity2)

    const result = await sut.findAll()
    const sortedItems = await sut['applySort'](result, null, null)
    expect(sortedItems[0].createdAt).toBe(entity2.createdAt)
    expect(sortedItems[1].createdAt).toBe(entity1.createdAt)
  })

  it('should sort items by name when sort is provided', async () => {
    const entity1 = new UserEntity(UserDataBuilder({ name: 'Bob' }))
    const entity2 = new UserEntity(UserDataBuilder({ name: 'Alice' }))
    await sut.insert(entity1)
    await sut.insert(entity2)

    const result = await sut.findAll()
    let sortedItems = await sut['applySort'](result, 'name', 'asc')
    expect(sortedItems[0].name).toBe('Alice')
    expect(sortedItems[1].name).toBe('Bob')

    sortedItems = await sut['applySort'](result, 'name', null)
    expect(sortedItems[0].name).toBe('Bob')
    expect(sortedItems[1].name).toBe('Alice')
  })
})
