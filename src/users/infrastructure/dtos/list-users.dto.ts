import { SortDirection } from '@/shared/domain/repositories/searchable-repository-contracts'
import { ListUsersUseCase } from '@/users/application/usecases/list-users.usecase'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional } from 'class-validator'

export class ListUsersDto implements ListUsersUseCase.Input {
  @ApiPropertyOptional({ example: 1, description: 'Page number' })
  @IsOptional()
  page?: number

  @ApiPropertyOptional({ example: 10, description: 'Number of users per page' })
  @IsOptional()
  perPage?: number

  @ApiPropertyOptional({ example: 'name', description: 'Field to sort by' })
  @IsOptional()
  sort?: string

  @ApiPropertyOptional({
    example: 'asc',
    description: 'Sort direction',
    enum: ['asc', 'desc'],
  })
  @IsOptional()
  sortDirection?: SortDirection

  @ApiPropertyOptional({ example: 'john', description: 'Filter term' })
  @IsOptional()
  filter?: string
}
