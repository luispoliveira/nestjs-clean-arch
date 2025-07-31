import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator'
import { ClassValidatorFields } from '../../class-validator-fields'

class StubRules {
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  name: string

  @IsNumber()
  @IsNotEmpty()
  price: number

  constructor(data: any) {
    Object.assign(this, data)
  }
}

class StubClassValidatorFields extends ClassValidatorFields<StubRules> {
  validate(props: any): boolean {
    return super.validate(new StubRules(props))
  }
}

describe('ClassValidatorFields integration tests', () => {
  it('should validate with errors', () => {
    const validator = new StubClassValidatorFields()

    expect(validator.validate(null)).toBe(false)
    expect(validator.errors).toStrictEqual({
      name: [
        'name should not be empty',
        'name must be a string',
        'name must be shorter than or equal to 255 characters',
      ],
      price: [
        'price should not be empty',
        'price must be a number conforming to the specified constraints',
      ],
    })
    expect(validator.validatedData).toStrictEqual({})
  })

  it('should validate with valid data', () => {
    const validator = new StubClassValidatorFields()
    const isValid = validator.validate({
      name: 'Valid Name',
      price: 100,
    })

    expect(isValid).toBeTruthy()
    expect(validator.validatedData).toEqual({
      name: 'Valid Name',
      price: 100,
    })
    expect(validator.errors).toStrictEqual({})
  })
})
