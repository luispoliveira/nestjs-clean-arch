import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { UserValidator, UserValidatorFactory } from '../../user.validator'

let sut: UserValidator
describe('UserValidator unit tests', () => {
  beforeEach(() => {
    sut = UserValidatorFactory.create()
  })

  describe('Name field', () => {
    it('Invalidation cases for name field', () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      let isValid = sut.validate(null as any)
      expect(isValid).toBeFalsy()
      expect(sut.errors).not.toBeNull()
      expect(sut.errors!['name']).toStrictEqual([
        'name must be shorter than or equal to 255 characters',
        'name must be a string',
        'name should not be empty',
      ])

      isValid = sut.validate({ ...UserDataBuilder({}), name: '' })
      expect(isValid).toBeFalsy()
      expect(sut.errors).not.toBeNull()
      expect(sut.errors!['name']).toStrictEqual(['name should not be empty'])

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      isValid = sut.validate({ ...UserDataBuilder({}), name: 10 as any })
      expect(isValid).toBeFalsy()
      expect(sut.errors).not.toBeNull()
      expect(sut.errors!['name']).toStrictEqual([
        'name must be shorter than or equal to 255 characters',
        'name must be a string',
      ])

      isValid = sut.validate({ ...UserDataBuilder({}), name: 'a'.repeat(256) })
      expect(isValid).toBeFalsy()
      expect(sut.errors).not.toBeNull()
      expect(sut.errors!['name']).toStrictEqual([
        'name must be shorter than or equal to 255 characters',
      ])
    })
  })
})
