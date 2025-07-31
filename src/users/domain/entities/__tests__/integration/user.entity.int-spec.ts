import { EntityValidationError } from '@/shared/domain/errors/validation-error'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { UserEntity } from '../../user.entity'

describe('User Entity integration tests', () => {
  describe('Constructor method', () => {
    it('should throw an error when creating a user with invalid name', () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      let props = { ...UserDataBuilder({}), name: null as any }
      expect(() => new UserEntity(props)).toThrow(EntityValidationError)

      props = { ...UserDataBuilder({}), name: '' }
      expect(() => new UserEntity(props)).toThrow(EntityValidationError)

      props = { ...UserDataBuilder({}), name: 'a'.repeat(256) }
      expect(() => new UserEntity(props)).toThrow(EntityValidationError)

      props = { ...UserDataBuilder({}), name: 10 }
      expect(() => new UserEntity(props)).toThrow(EntityValidationError)
    })

    it('should throw an error when creating a user with invalid email', () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      let props = { ...UserDataBuilder({}), email: null as any }
      expect(() => new UserEntity(props)).toThrow(EntityValidationError)

      props = { ...UserDataBuilder({}), email: '' }
      expect(() => new UserEntity(props)).toThrow(EntityValidationError)

      props = { ...UserDataBuilder({}), email: 'invalid-email' }
      expect(() => new UserEntity(props)).toThrow(EntityValidationError)

      props = { ...UserDataBuilder({}), email: 10 }
      expect(() => new UserEntity(props)).toThrow(EntityValidationError)
    })

    it('should throw an error when creating a user with invalid password', () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      let props = { ...UserDataBuilder({}), password: null as any }
      expect(() => new UserEntity(props)).toThrow(EntityValidationError)

      props = { ...UserDataBuilder({}), password: '' }
      expect(() => new UserEntity(props)).toThrow(EntityValidationError)

      props = { ...UserDataBuilder({}), password: 10 }
      expect(() => new UserEntity(props)).toThrow(EntityValidationError)
    })

    it('should throw an error when creating a user with invalid createdAt', () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      let props = { ...UserDataBuilder({}), createdAt: '2023' as any }
      expect(() => new UserEntity(props)).toThrow(EntityValidationError)

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      props = { ...UserDataBuilder({}), createdAt: 10 as any }
      expect(() => new UserEntity(props)).toThrow(EntityValidationError)
    })

    it('should create a user with valid props', () => {
      const props = UserDataBuilder({})
      const user = new UserEntity(props)

      expect(user.name).toBe(props.name)
      expect(user.email).toBe(props.email)
      expect(user.password).toBe(props.password)
      expect(user.createdAt).toBeDefined()
    })
  })
})
