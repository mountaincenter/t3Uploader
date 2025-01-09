export const generateThumbnail = async (
  file: File,
  width: 100,
): Promise<File> => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const img = new Image();

  img.src = URL.createObjectURL(file);
  await new Promise<void>((resolve) => {
    img.onload = () => resolve();
  });

  const thumbnailHeight = (img.height / img.width) * width;
  canvas.width = width;
  canvas.height = thumbnailHeight;

  ctx?.drawImage(img, 0, 0, width, thumbnailHeight);

  const isPNG = file.type === "image/png";
  const mimeType = isPNG ? "image/png" : "image/jpeg";
  const extension = isPNG ? "png" : "jpeg";

  return new Promise<File>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        const baseName = file.name.replace(/\.[^/.]+$/, "");
        const newFileName = `${baseName}-thumbnail.${extension}`;
        resolve(new File([blob], newFileName, { type: mimeType }));
      } else {
        reject(new Error("Failed to generate thumbnail"));
      }
    }, mimeType);
  });
};
