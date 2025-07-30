import * as libClassValidator from 'class-validator'
import { ClassValidatorFields } from '../../class-validator-fields'

class StubClassValidatorFields extends ClassValidatorFields<{
  field: string
}> {}

describe('ClassValidatorFields unit tests', () => {
  it('should initialize errors and validatedData as null', () => {
    const sut = new StubClassValidatorFields()
    expect(sut.errors).toBeNull()
    expect(sut.validatedData).toBeNull()
  })

  it('should validate with errors', () => {
    const spyValidateSync = jest.spyOn(libClassValidator, 'validateSync')
    spyValidateSync.mockReturnValue([
      {
        property: 'field',
        constraints: { isRequired: 'test error' },
      },
    ])
    const sut = new StubClassValidatorFields()
    const props = { field: '' }
    const isValid = sut.validate(props)

    expect(isValid).toBe(false)
    expect(spyValidateSync).toHaveBeenCalledWith(props)
    expect(sut.errors).toStrictEqual({ field: ['test error'] })
    expect(sut.validatedData).toBeNull()
  })
})
