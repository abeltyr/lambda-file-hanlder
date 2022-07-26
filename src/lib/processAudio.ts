import { AudioBufferInput, HandlerError, StatusCodes } from "../_type";

const LAMBDA_PAYLOAD_LIMIT = 12 * 1024 * 1024;

export const processAudio: (
  originalAudio: Buffer,
  edits: AudioBufferInput,
) => Promise<string> = async (originalImage, edits) => {
  let base64EncodedImage = "";

  let audio = originalImage;

  base64EncodedImage = audio.toString("base64");

  // binary data need to be base64 encoded to pass to the API Gateway proxy https://docs.aws.amazon.com/apigateway/latest/developerguide/lambda-proxy-binary-media.html.
  // checks whether base64 encoded image fits in 6M limit, see https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-limits.html.
  if (base64EncodedImage.length > LAMBDA_PAYLOAD_LIMIT) {
    throw new HandlerError(
      StatusCodes.REQUEST_TOO_LONG,
      "TooLargeImageException",
      "The converted image is too large to return.",
    );
  }

  return base64EncodedImage;
};
