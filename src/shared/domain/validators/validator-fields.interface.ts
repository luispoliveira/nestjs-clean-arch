export type FieldsErrors = {
  [field: string]: string[]
}

export interface ValidatorFieldsInterface<PropsValidated> {
  errors: FieldsErrors | null
  validatedData: PropsValidated | null
  validate(props: PropsValidated): boolean
}
