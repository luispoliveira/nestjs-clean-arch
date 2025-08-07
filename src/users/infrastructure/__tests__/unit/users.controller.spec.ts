import { UserOutputDTO } from '@/users/application/dtos/user-output.dto'
import { SignInUseCase } from '@/users/application/usecases/sign-in.usecase'
import { SignUpUseCase } from '@/users/application/usecases/sign-up.usecase'
import { v4 as uuidv4 } from 'uuid'
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

    const input: SignUpUseCase.Input = {
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

    const input: SignInUseCase.Input = {
      email: props.email,
      password: props.password,
    }
    const result = await sut.signIn(input)
    expect(output).toStrictEqual(result)
    expect(mockSignInUseCase.execute).toHaveBeenCalledWith(input)
  })
})
