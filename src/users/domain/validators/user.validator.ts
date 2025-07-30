import { ClassValidatorFields } from '@/shared/domain/validators/class-validator-fields'
import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator'
import { UserProps } from '../entities/user.entity'

export class UserRules {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  password: string

  @IsOptional()
  @IsDate()
  createdAt?: Date

  constructor({ email, name, password, createdAt }: UserProps) {
    Object.assign(this, { email, name, password, createdAt })
  }
}

export class UserValidator extends ClassValidatorFields<UserRules> {
  validate(props: UserProps): boolean {
    return super.validate(new UserRules(props ?? {}))
  }
}

export class UserValidatorFactory {
  static create(): UserValidator {
    return new UserValidator()
  }
}
