import { ImageSizeEnum, ImageSizeNumerical } from "../../_type";

export const getSize: (
  sizeEnum: ImageSizeEnum | undefined,
) => ImageSizeNumerical = (sizeEnum) => {
  switch (sizeEnum) {
    case "Small":
      return 252;
    case "Medium":
      return 524;
    case "Large":
      return 1048;
    default:
      return 524;
  }
};
