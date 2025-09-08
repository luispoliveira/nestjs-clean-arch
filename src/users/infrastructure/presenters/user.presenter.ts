import { UserOutputDTO } from '@/users/application/dtos/user-output.dto'
import { Transform } from 'class-transformer'

export class UserPresenter {
  id: string
  name: string
  email: string
  @Transform(({ value }: { value: Date }) => value.toISOString())
  createdAt: Date

  constructor(output: UserOutputDTO) {
    this.id = output.id
    this.name = output.name
    this.email = output.email
    this.createdAt = output.createdAt
  }
}
