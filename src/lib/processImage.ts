import {
  ImageBufferInput,
  ImageFormat,
  HandlerError,
  StatusCodes,
} from "../_type";

import * as sharp from "sharp";
import { getSize } from "../utils/image/imageGetSize";
import { getFormat } from "../utils/image/imageGetFormat";

const LAMBDA_PAYLOAD_LIMIT = 6 * 1024 * 1024;

export const processImage: (
  originalImage: Buffer,
  edits: ImageBufferInput,
) => Promise<string> = async (originalImage, edits) => {
  let base64EncodedImage = "";

  let image = originalImage;

  if (!(edits && edits.default)) {
    let size = getSize(edits.size);
    let format: ImageFormat = getFormat(edits.format);

    console.log("EDIT", { size, format });
    image = await sharp(image)
      .resize({ height: size, width: size })
      .toFormat(format)
      .toBuffer();
  }

  base64EncodedImage = image.toString("base64");

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
