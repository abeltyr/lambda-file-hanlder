import { HandlerError, OriginalFileInfo, StatusCodes } from "../_type";
import * as S3 from "aws-sdk/clients/s3";

const s3Client = new S3({
  apiVersion: "2006-03-01",
  accessKeyId: process.env.AWS_ACCESS_KEY_ID_FOR_MEMUSIC,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_FOR_MEMUSIC,
});

export const getOriginalFile: (
  bucket: string,
  key: string,
) => Promise<OriginalFileInfo> = async (bucket, key) => {
  try {
    const result: OriginalFileInfo = {};

    const fileLocation = { Bucket: bucket, Key: key };
    const originalFile = await s3Client.getObject(fileLocation).promise();
    const fileBuffer = Buffer.from(originalFile.Body as Uint8Array);

    if (originalFile.ContentType) {
      // If using default S3 ContentType infer from hex headers
      if (
        ["binary/octet-stream", "application/octet-stream"].includes(
          originalFile.ContentType,
        )
      ) {
        result.contentType = inferImageType(fileBuffer);
      } else {
        result.contentType = originalFile.ContentType;
      }
    } else {
      result.contentType = "image";
    }

    if (originalFile.Expires) {
      result.expires = new Date(originalFile.Expires).toUTCString();
    }

    if (originalFile.LastModified) {
      result.lastModified = new Date(originalFile.LastModified).toUTCString();
    }

    result.cacheControl =
      originalFile.CacheControl ?? "max-age=31536000,public";
    result.originalFile = fileBuffer;

    return result;
  } catch (error) {
    let status = StatusCodes.INTERNAL_SERVER_ERROR;
    let message = error.message;
    if (error.code === "NoSuchKey") {
      status = StatusCodes.NOT_FOUND;
      message = `The image ${key} does not exist or the request may not be base64 encoded properly.`;
    }

    throw new HandlerError(status, error.code, message);
  }
};

const inferImageType = (fileBuffer: Buffer): string => {
  const fileSignature = fileBuffer.slice(0, 4).toString("hex").toUpperCase();
  switch (fileSignature) {
    case "89504E47":
      return "image/png";
    case "FFD8FFDB":
    case "FFD8FFE0":
    case "FFD8FFEE":
    case "FFD8FFE1":
      return "image/jpeg";
    case "52494646":
      return "image/webp";
    case "49492A00":
      return "image/tiff";
    case "4D4D002A":
      return "image/tiff";
    case "49443303":
    case "52494646":
      return "audio/mp3";
    default:
      throw new HandlerError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "RequestTypeError",
        "The file does not have an extension and the file type could not be inferred. Please ensure that your original image is of a supported file type (jpg, png, tiff, webp, svg). Refer to the documentation for additional guidance on forming image requests.",
      );
  }
};
