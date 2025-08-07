import { UserOutputDTO } from '@/users/application/dtos/user-output.dto'
import { SignInUseCase } from '@/users/application/usecases/sign-in.usecase'
import { SignUpUseCase } from '@/users/application/usecases/sign-up.usecase'
import { v4 as uuidv4 } from 'uuid'
import { SignInDto } from '../../dtos/sign-in.dto'
import { SignUpDto } from '../../dtos/sign-up.dto'
import { UpdatePasswordDto } from '../../dtos/update-password.dto'
import { UpdateUserDto } from '../../dtos/update-user.dto'
import { UsersController } from '../../users.controller'
describe('UsersController unit tests', () => {
  let sut: UsersController
  let id: string
  let props: UserOutputDTO

  beforeEach(() => {
    sut = new UsersController()
    id = uuidv4()
    props = {
      id,
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
      createdAt: new Date(),
    }
  })

  it('should be defined', () => {
    expect(sut).toBeDefined()
  })

  it('should create a user', async () => {
    const output: SignUpUseCase.Output = props
    const mockSignUpUseCase = {
      execute: jest.fn().mockResolvedValue(output),
    }

    sut['signUpUseCase'] = mockSignUpUseCase as any

    const input: SignUpDto = {
      name: props.name,
      email: props.email,
      password: props.password,
    }
    const result = await sut.create(input)
    expect(output).toStrictEqual(result)
    expect(mockSignUpUseCase.execute).toHaveBeenCalledWith(input)
  })

  it('should sign in a user', async () => {
    const output: SignInUseCase.Output = props
    const mockSignInUseCase = {
      execute: jest.fn().mockResolvedValue(output),
    }

    sut['signInUseCase'] = mockSignInUseCase as any

    const input: SignInDto = {
      email: props.email,
      password: props.password,
    }
    const result = await sut.signIn(input)
    expect(output).toStrictEqual(result)
    expect(mockSignInUseCase.execute).toHaveBeenCalledWith(input)
  })

  it('should update a user', async () => {
    const mockUpdateUserUseCase = {
      execute: jest.fn().mockResolvedValue(props),
    }

    sut['updateUserUseCase'] = mockUpdateUserUseCase as any

    const updateUserDto: UpdateUserDto = {
      name: 'Jane Doe',
    }

    const result = await sut.update(id, updateUserDto)
    expect(result).toStrictEqual(props)
    expect(mockUpdateUserUseCase.execute).toHaveBeenCalledWith({
      id,
      ...updateUserDto,
    })
  })

  it('should update a user password', async () => {
    const mockUpdatePasswordUseCase = {
      execute: jest.fn().mockResolvedValue(props),
    }

    sut['updatePasswordUseCase'] = mockUpdatePasswordUseCase as any

    const updatePasswordDto: UpdatePasswordDto = {
      oldPassword: 'password123',
      password: 'newpassword123',
    }

    const result = await sut.updatePassword(id, updatePasswordDto)
    expect(result).toStrictEqual(props)
    expect(mockUpdatePasswordUseCase.execute).toHaveBeenCalledWith({
      id,
      ...updatePasswordDto,
    })
  })

  it('should delete a user', async () => {
    const mockDeleteUserUseCase = {
      execute: jest.fn().mockResolvedValue(undefined),
    }

    sut['deleteUserUseCase'] = mockDeleteUserUseCase as any

    const result = await sut.remove(id)
    expect(result).toBeUndefined()
    expect(mockDeleteUserUseCase.execute).toHaveBeenCalledWith({ id })
  })

  it('should find a user by id', async () => {
    const mockGetUserUseCase = {
      execute: jest.fn().mockResolvedValue(props),
    }

    sut['getUserUseCase'] = mockGetUserUseCase as any

    const result = await sut.findOne(id)
    expect(result).toStrictEqual(props)
    expect(mockGetUserUseCase.execute).toHaveBeenCalledWith({ id })
  })

  it('should search users', async () => {
    const mockListUsersUseCase = {
      execute: jest.fn().mockResolvedValue([props]),
    }

    sut['listUsersUseCase'] = mockListUsersUseCase as any

    const result = await sut.search({})
    expect(result).toStrictEqual([props])
    expect(mockListUsersUseCase.execute).toHaveBeenCalledWith({})
  })
})
