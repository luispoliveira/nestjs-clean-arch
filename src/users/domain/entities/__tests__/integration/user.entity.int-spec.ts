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
    })
  })
})
