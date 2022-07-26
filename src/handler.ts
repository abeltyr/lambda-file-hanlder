import { getOriginalFile } from "./lib/getOriginalFile";
import { extractBuffer } from "./lib/extractBuffer";
import { getResponseHeaders } from "./utils/getResponseHeaders";
import { BufferInput, OriginalFileInfo, StatusCodes } from "./_type";
import { processImage } from "./lib/processImage";
import { processAudio } from "./lib/processAudio";

module.exports.handler = async (event) => {
  let getRequest = event.pathParameters.buffer;

  const isAlb =
    event.requestContext &&
    Object.prototype.hasOwnProperty.call(event.requestContext, "elb");

  let headers = getResponseHeaders(false, isAlb);

  let data: BufferInput = await extractBuffer(getRequest);

  let defaultFallbackFile: OriginalFileInfo | null = null;
  defaultFallbackFile = await getOriginalFile(data.bucket, data.key);

  if (!defaultFallbackFile || !defaultFallbackFile.originalFile)
    return {
      statusCode: StatusCodes.NOT_FOUND,
      headers,
      body: JSON.stringify({
        code: "ExtractionFail",
        message: "File is not found.",
      }),
    };

  let processedRequest;

  if (defaultFallbackFile.contentType?.includes("image"))
    processedRequest = await processImage(defaultFallbackFile.originalFile, {
      ...data.edits,
    });
  else if (defaultFallbackFile.contentType?.includes("audio"))
    processedRequest = await processAudio(defaultFallbackFile.originalFile, {
      ...data.edits,
    });

  headers["Content-Type"] = defaultFallbackFile.contentType;
  headers["Expires"] = defaultFallbackFile.expires;
  headers["Last-Modified"] = defaultFallbackFile.lastModified;
  headers["Cache-Control"] = defaultFallbackFile.cacheControl;
  headers["Access-Control-Allow-Methods"] = "GET";
  headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization";

  return {
    statusCode: StatusCodes.OK,
    isBase64Encoded: true,
    headers,
    body: processedRequest,
  };
};
