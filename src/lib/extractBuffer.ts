import { HandlerError, BufferInput, StatusCodes } from "../_type";

export const extractBuffer: (requestBuffer: string) => BufferInput = (
  requestBuffer,
) => {
  const toBuffer = Buffer.from(requestBuffer, "base64");
  let data;

  try {
    data = JSON.parse(toBuffer.toString());
  } catch (error) {
    throw new HandlerError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "BufferIssue",
      "Issue With Buffer ",
    );
  }

  if (!data.bucket)
    throw new HandlerError(
      StatusCodes.BAD_REQUEST,
      "BucketNotProvided",
      "Buffer Issue:Bucket is not provided",
    );

  if (!data.key)
    throw new HandlerError(
      StatusCodes.BAD_REQUEST,
      "KeyNotProvided",
      "Buffer Issue:Key is not provided",
    );

  if (!data.ETag)
    throw new HandlerError(
      StatusCodes.BAD_REQUEST,
      "ETagNotProvided",
      "Buffer Issue:ETag is not provided",
    );

  return {
    bucket: data.bucket,
    key: data.key,
    ETag: data.ETag,
    edits: data.edits,
  };
};
