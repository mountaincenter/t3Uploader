import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { AWS_CONFIG } from "@/constants/awsConfig";

const s3Client = new S3Client({
  region: AWS_CONFIG.region,
  credentials: AWS_CONFIG.credentials,
});

export const uploadFileToS3 = async (
  file: File,
  keyPrefix: string,
  timestamp: string,
) => {
  const fileName = `${timestamp}-${file.name}`;
  const params = {
    Bucket: AWS_CONFIG.bucketName,
    Key: `${keyPrefix}/${fileName}`,
    Body: file,
    ContentType: file.type,
  };

  const command = new PutObjectCommand(params);
  return s3Client.send(command);
};

export const deleteFileToS3 = async (key: string) => {
  console.log("Attempting to delete key:", key);
  const params = {
    Bucket: AWS_CONFIG.bucketName,
    Key: key,
  };

  const command = new DeleteObjectCommand(params);
  await s3Client.send(command);
};
