export class InvalidCredentials extends Error {
  constructor(public message: string) {
    super(message)
    this.name = InvalidCredentials.name
  }
}
