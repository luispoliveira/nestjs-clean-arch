import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { UserEntity, UserProps } from '../../user.entity'

describe('User Entity unit tests', () => {
  let props: UserProps
  let sut: UserEntity
  beforeEach(() => {
    UserEntity.validate = jest.fn()
    props = UserDataBuilder({})
    sut = new UserEntity(props)
  })
  it('Constructed method', () => {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(UserEntity.validate).toHaveBeenCalled()
    expect(sut.props.name).toBe(props.name)
    expect(sut.props.email).toBe(props.email)
    expect(sut.props.password).toBe(props.password)
    expect(sut.props.createdAt).toBeDefined()
    expect(sut.props.createdAt).toBeInstanceOf(Date)
  })

  it('Getter of name field', () => {
    expect(sut.name).toBeDefined()
    expect(sut.name).toEqual(props.name)
    expect(typeof sut.name).toBe('string')
  })

  it('Getter of email field', () => {
    expect(sut.email).toBeDefined()
    expect(sut.email).toEqual(props.email)
    expect(typeof sut.email).toBe('string')
  })

  it('Getter of password field', () => {
    expect(sut.password).toBeDefined()
    expect(sut.password).toEqual(props.password)
    expect(typeof sut.password).toBe('string')
  })

  it('Getter of createdAt field', () => {
    expect(sut.createdAt).toBeDefined()
    expect(sut.createdAt).toBeInstanceOf(Date)
  })

  it('Setter of name field', () => {
    const newName = 'New Name'
    sut['name'] = newName
    expect(sut.name).toBe(newName)
  })

  it('Setter of password field', () => {
    const newPassword = 'New Password'
    sut['password'] = newPassword
    expect(sut.password).toBe(newPassword)
  })

  it('should update a user', () => {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(UserEntity.validate).toHaveBeenCalled()
    const newName = 'Updated Name'
    sut.update(newName)
    expect(sut.name).toBe(newName)
  })

  it('should update a user password', () => {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(UserEntity.validate).toHaveBeenCalled()
    const newPassword = 'Updated Password'
    sut.updatePassword(newPassword)
    expect(sut.password).toBe(newPassword)
  })
})
