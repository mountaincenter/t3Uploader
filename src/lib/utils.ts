import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const uploadFileToS3 = async (
  file: File,
  keyPrefix: string,
  timestamp: string,
) => {
  const s3Client = new S3Client({
    region: process.env.NEXT_PUBLIC_AWS_REGION,
    credentials: {
      accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!,
    },
    forcePathStyle: true,
  });

  const fileName = `${timestamp}-${file.name}`; // タイムスタンプを付与
  const params = {
    Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
    Key: `${keyPrefix}/${fileName}`,
    Body: file,
    ContentType: file.type,
  };

  const command = new PutObjectCommand(params);
  return s3Client.send(command);
};

// サムネイル生成関数
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

  return new Promise<File>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        const baseName = file.name.replace(/\.[^/.]+$/, ""); // 拡張子を除く
        const newFileName = `${baseName}-thumbnail.jpeg`; // サムネイル名
        resolve(new File([blob], newFileName, { type: "image/jpeg" }));
      } else {
        reject(new Error("Failed to generate thumbnail"));
      }
    }, "image/jpeg");
  });
};
