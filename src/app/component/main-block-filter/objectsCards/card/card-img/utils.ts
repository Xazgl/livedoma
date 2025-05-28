import { ObjectIntrum } from "@prisma/client";
import noPhoto from "/public/images/noPhoto.jpg";
import { isImage } from "@/shared/utils";


export const getValidImageSrc = (object: ObjectIntrum): string => {
  if (object?.thubmnail[0]) {
    return object.thubmnail[0];
  }
  if (object?.img[0]) {
    return object.img[0];
  }
  if (object.imgUrl && object.imgUrl.length > 0) {
    const validImg = object.imgUrl.find((url) => isImage(url));
    console.log('validImg', validImg)
    if (validImg) {
      return validImg;
    }
  }
  return noPhoto.src;
};
