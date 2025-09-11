import { instanceToPlain } from 'class-transformer'
import { UserPresenter } from '../../user.presenter'

describe('UserPresenter unit tests', () => {
  let sut: UserPresenter
  const createdAt = new Date()
  const props = {
    id: 'e7b8c9f0-3d6a-4c2a-9f1e-1c2b3a4d5e6f',
    name: 'John Doe',
    email: 'john.doe@example.com',
    createdAt,
    password: 'hashed_password',
  }

  beforeEach(() => {
    sut = new UserPresenter(props)
  })

  describe('constructor', () => {
    it('should be defined', () => {
      expect(sut.id).toEqual(props.id)
      expect(sut.name).toEqual(props.name)
      expect(sut.email).toEqual(props.email)
      expect(sut.createdAt).toEqual(props.createdAt)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect((sut as any).password).toBeUndefined()
    })
  })
  it('should presenter data', () => {
    const output = instanceToPlain(sut)
    expect(output).toStrictEqual({
      id: 'e7b8c9f0-3d6a-4c2a-9f1e-1c2b3a4d5e6f',
      name: 'John Doe',
      email: 'john.doe@example.com',
      createdAt: createdAt.toISOString(),
    })
  })
})
