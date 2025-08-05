import { HashProvider } from '@/shared/application/providers/hash.provider'
import { compare, hash } from 'bcryptjs'

export class BcryptjsHashProvider implements HashProvider {
  async generateHash(payload: string): Promise<string> {
    return await hash(payload, 10)
  }

  async compareHash(payload: string, hash: string): Promise<boolean> {
    return await compare(payload, hash)
  }
}
