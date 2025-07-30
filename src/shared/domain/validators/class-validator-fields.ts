import { validateSync } from 'class-validator'
import {
  FieldsErrors,
  ValidatorFieldsInterface,
} from './validator-fields.interface'

export abstract class ClassValidatorFields<PropsValidated>
  implements ValidatorFieldsInterface<PropsValidated>
{
  errors: FieldsErrors = {}
  validatedData: PropsValidated

  validate(props: PropsValidated): boolean {
    const errors = validateSync(props as object)
    if (errors.length) {
      this.errors = {}
      for (const error of errors) {
        const field = error.property
        this.errors[field] = Object.values(error.constraints || {})
      }
    } else {
      this.validatedData = props
    }

    return !errors.length
  }

  protected addError(field: string, message: string): void {
    if (!this.errors[field]) {
      this.errors[field] = []
    }
    this.errors[field].push(message)
  }
}
