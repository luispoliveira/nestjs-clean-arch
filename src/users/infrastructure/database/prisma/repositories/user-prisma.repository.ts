import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { PrismaService } from '@/shared/infrastructure/database/prisma/prisma.service'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserRepository } from '@/users/domain/repositories/user.repository'
import { UserModelMapper } from '../models/user-model.mapper'

export class UserPrismaRepository implements UserRepository.Repository {
  sortableFields: string[] = ['name', 'createdAt']

  constructor(private prismaService: PrismaService) {}

  async findByEmail(email: string): Promise<UserEntity> {
    throw new Error('Method not implemented.')
  }
  emailExists(email: string): Promise<void> {
    throw new Error('Method not implemented.')
  }
  async search(
    input: UserRepository.SearchParams,
  ): Promise<UserRepository.SearchResult> {
    const sortable = input.sort
      ? this.sortableFields.includes(input.sort)
      : false

    const orderByField = sortable && input.sort ? input.sort : 'createdAt'
    const orderByDir =
      sortable && input.sortDirection ? input.sortDirection : 'desc'

    const count = await this.prismaService.user.count({
      ...(input.filter && {
        where: {
          name: {
            contains: input.filter || undefined,
            mode: 'insensitive',
          },
        },
      }),
    })

    const models = await this.prismaService.user.findMany({
      ...(input.filter && {
        where: {
          name: {
            contains: input.filter || undefined,
            mode: 'insensitive',
          },
        },
      }),
      orderBy: {
        [orderByField]: orderByDir,
      },
      skip: input.page && input.page > 0 ? (input.page - 1) * input.perPage : 0,
      take: input.perPage && input.perPage > 0 ? input.perPage : 15,
    })

    return new UserRepository.SearchResult({
      items: models.map(model => UserModelMapper.toEntity(model)),
      total: count,
      perPage: input.perPage,
      currentPage: input.page,
      sort: orderByField,
      sortDirection: orderByDir,
      filter: input.filter,
    })
  }

  async insert(entity: UserEntity): Promise<void> {
    await this.prismaService.user.create({
      data: {
        ...entity.toJSON(),
      },
    })
  }

  async findById(id: string): Promise<UserEntity> {
    return await this._get(id)
  }

  async findAll(): Promise<UserEntity[]> {
    const models = await this.prismaService.user.findMany()

    return models.map(model => UserModelMapper.toEntity(model))
  }

  async update(entity: UserEntity): Promise<void> {
    await this._get(entity.id) // Ensure

    await this.prismaService.user.update({
      where: { id: entity.id },
      data: {
        ...entity.toJSON(),
      },
    })
  }

  async delete(id: string): Promise<void> {
    await this._get(id) // Ensure

    await this.prismaService.user.delete({
      where: { id },
    })
  }

  protected async _get(id: string): Promise<UserEntity> {
    try {
      const user = await this.prismaService.user.findUniqueOrThrow({
        where: { id },
      })
      return UserModelMapper.toEntity(user)
    } catch {
      throw new NotFoundError(`User with id ${id} not found`)
    }
  }
}
