import { StatusCodes } from "./status";

export class HandlerError extends Error {
  constructor(
    public readonly status: StatusCodes,
    public readonly code: string,
    public readonly message: string,
  ) {
    super();
  }
}
