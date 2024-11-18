export class DbError extends Error {
  constructor(public message: string, public statusCode: number) {
    super(message);
  }
}
