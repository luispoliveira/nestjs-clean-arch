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
      expect.assertions(0)

      const props = UserDataBuilder({})
      new UserEntity(props)
    })
  })

  describe('Update method', () => {
    it('should throw an error when updating a user with invalid name', () => {
      const entity = new UserEntity(UserDataBuilder({}))

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      expect(() => entity.update(null as any)).toThrow(EntityValidationError)
      expect(() => entity.update('')).toThrow(EntityValidationError)
      expect(() => entity.update('a'.repeat(256))).toThrow(
        EntityValidationError,
      )
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      expect(() => entity.update(10 as any)).toThrow(EntityValidationError)
    })

    it('should update user with valid name', () => {
      expect.assertions(0)
      const entity = new UserEntity(UserDataBuilder({}))

      const newName = 'New Name'
      entity.update(newName)
    })
  })

  describe('UpdatePassword method', () => {
    it('should throw an error when updating a user with invalid password', () => {
      const entity = new UserEntity(UserDataBuilder({}))

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      expect(() => entity.updatePassword(null as any)).toThrow(
        EntityValidationError,
      )
      expect(() => entity.updatePassword('')).toThrow(EntityValidationError)
      expect(() => entity.updatePassword('a'.repeat(256))).toThrow(
        EntityValidationError,
      )
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      expect(() => entity.updatePassword(10 as any)).toThrow(
        EntityValidationError,
      )
    })

    it('should update user with valid password', () => {
      expect.assertions(0)
      const entity = new UserEntity(UserDataBuilder({}))

      const newPassword = 'NewPassword123'
      entity.updatePassword(newPassword)
    })
  })
})
