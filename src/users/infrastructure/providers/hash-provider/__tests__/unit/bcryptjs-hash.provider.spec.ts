import { BcryptjsHashProvider } from '../../bcryptjs-hash.provider'

describe('BcryptjsHashProvider unit test', () => {
  let sut: BcryptjsHashProvider

  beforeEach(() => {
    sut = new BcryptjsHashProvider()
  })

  it('should generate a hash from a payload', async () => {
    const payload = 'password123'
    const hash = await sut.generateHash(payload)

    expect(hash).toBeDefined()
    expect(typeof hash).toBe('string')
    expect(hash.length).toBeGreaterThan(0)
  })

  it('should compare a payload with a hash', async () => {
    const payload = 'password123'
    const hash = await sut.generateHash(payload)

    const isMatch = await sut.compareHash(payload, hash)
    expect(isMatch).toBe(true)

    const wrongPayload = 'wrongPassword'
    const isWrongMatch = await sut.compareHash(wrongPayload, hash)
    expect(isWrongMatch).toBe(false)
  })
})
