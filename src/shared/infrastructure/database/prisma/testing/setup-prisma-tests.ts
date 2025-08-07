import { execSync } from 'node:child_process'

export function setupPrismaTests() {
  execSync('npx dotenv-cli -e .env.test.local -- prisma migrate deploy')
}
