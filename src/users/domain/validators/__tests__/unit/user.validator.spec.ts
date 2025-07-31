import { UserProps } from '@/users/domain/entities/user.entity'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import {
  UserRules,
  UserValidator,
  UserValidatorFactory,
} from '../../user.validator'

let sut: UserValidator
let props: UserProps
describe('UserValidator unit tests', () => {
  beforeEach(() => {
    sut = UserValidatorFactory.create()
    props = UserDataBuilder({})
  })
  it('Valide cases for user rules', () => {
    const isValid = sut.validate(props)

    expect(isValid).toBeTruthy()
    expect(sut.errors).toStrictEqual({})
    expect(sut.validatedData).toStrictEqual(new UserRules(props))
  })
  describe('Name field', () => {
    it('Invalidation cases for name field', () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      let isValid = sut.validate(null as any)
      expect(isValid).toBeFalsy()
      expect(sut.errors).not.toBeNull()
      expect(sut.errors['name']).toStrictEqual([
        'name must be shorter than or equal to 255 characters',
        'name must be a string',
        'name should not be empty',
      ])

      isValid = sut.validate({ ...UserDataBuilder({}), name: '' })
      expect(isValid).toBeFalsy()
      expect(sut.errors).not.toBeNull()
      expect(sut.errors['name']).toStrictEqual(['name should not be empty'])

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      isValid = sut.validate({ ...UserDataBuilder({}), name: 10 as any })
      expect(isValid).toBeFalsy()
      expect(sut.errors).not.toBeNull()
      expect(sut.errors['name']).toStrictEqual([
        'name must be shorter than or equal to 255 characters',
        'name must be a string',
      ])

      isValid = sut.validate({ ...UserDataBuilder({}), name: 'a'.repeat(256) })
      expect(isValid).toBeFalsy()
      expect(sut.errors).not.toBeNull()
      expect(sut.errors['name']).toStrictEqual([
        'name must be shorter than or equal to 255 characters',
      ])
    })
  })

  describe('Email field', () => {
    it('Invalidation cases for naemailme field', () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      let isValid = sut.validate(null as any)
      expect(isValid).toBeFalsy()
      expect(sut.errors).not.toBeNull()

      expect(sut.errors['email']).toStrictEqual([
        'email must be an email',
        'email must be a string',
        'email should not be empty',
      ])

      isValid = sut.validate({ ...UserDataBuilder({}), email: '' })
      expect(isValid).toBeFalsy()
      expect(sut.errors).not.toBeNull()
      expect(sut.errors['email']).toStrictEqual([
        'email must be an email',
        'email should not be empty',
      ])

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      isValid = sut.validate({ ...UserDataBuilder({}), email: 10 as any })
      expect(isValid).toBeFalsy()
      expect(sut.errors).not.toBeNull()
      expect(sut.errors['email']).toStrictEqual([
        'email must be an email',
        'email must be a string',
      ])
    })
  })

  describe('Password field', () => {
    it('Invalidation cases for password field', () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      let isValid = sut.validate(null as any)
      expect(isValid).toBeFalsy()
      expect(sut.errors).not.toBeNull()
      expect(sut.errors['password']).toStrictEqual([
        'password must be shorter than or equal to 100 characters',
        'password must be a string',
        'password should not be empty',
      ])

      isValid = sut.validate({ ...UserDataBuilder({}), password: '' })
      expect(isValid).toBeFalsy()
      expect(sut.errors).not.toBeNull()
      expect(sut.errors['password']).toStrictEqual([
        'password should not be empty',
      ])

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      isValid = sut.validate({ ...UserDataBuilder({}), password: 10 as any })
      expect(isValid).toBeFalsy()
      expect(sut.errors).not.toBeNull()
      expect(sut.errors['password']).toStrictEqual([
        'password must be shorter than or equal to 100 characters',
        'password must be a string',
      ])

      isValid = sut.validate({
        ...UserDataBuilder({}),
        password: 'a'.repeat(101),
      })
      expect(isValid).toBeFalsy()
      expect(sut.errors).not.toBeNull()
      expect(sut.errors['password']).toStrictEqual([
        'password must be shorter than or equal to 100 characters',
      ])
    })
  })

  describe('CreatedAt field', () => {
    it('Invalidation cases for createdAt field', () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      let isValid = sut.validate({ ...props, createdAt: 10 as any })
      expect(isValid).toBeFalsy()
      expect(sut.errors).not.toBeNull()
      expect(sut.errors['createdAt']).toStrictEqual([
        'createdAt must be a Date instance',
      ])

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      isValid = sut.validate({ ...props, createdAt: '2023' as any })
      expect(isValid).toBeFalsy()
      expect(sut.errors).not.toBeNull()
      expect(sut.errors['createdAt']).toStrictEqual([
        'createdAt must be a Date instance',
      ])
    })
  })
})
