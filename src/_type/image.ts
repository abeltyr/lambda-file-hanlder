export interface ImageBufferInput {
  size?: ImageSizeEnum;
  format?: ImageFormat;
  default?: boolean;
}

export type ImageSizeEnum = "Small" | "Medium" | "Large" | "Default";
export type ImageFormat = "avif" | "jpeg" | "jpg" | "png" | "webp";

export type ImageSizeNumerical = 252 | 524 | 1048;
