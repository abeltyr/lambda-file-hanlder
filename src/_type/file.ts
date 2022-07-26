import { AudioBufferInput } from "./audio";
import { ImageBufferInput } from "./image";

export type OriginalFileInfo = Partial<{
  contentType: string;
  expires: string;
  lastModified: string;
  cacheControl: string;
  originalFile: Buffer;
}>;

export type BufferInput = {
  bucket: string;
  key: string;
  ETag: string;
  edits?: ImageBufferInput | AudioBufferInput;
};
