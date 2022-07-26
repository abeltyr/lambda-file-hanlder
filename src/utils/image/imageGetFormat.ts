import { ImageFormat } from "../../_type";

const formats: ImageFormat[] = ["avif", "jpeg", "jpg", "png", "webp"];

export const getFormat: (format: string | undefined) => ImageFormat = (
  format,
) => {
  if (format && formats.includes(format as ImageFormat)) {
    return format as ImageFormat;
  }
  return "jpg";
};
