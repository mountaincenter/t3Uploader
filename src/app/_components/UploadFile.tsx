"use client";

import { uploadFileToS3 } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

interface UploadFileProps {
  file: File;
  keyPrefix: string; // S3のアップロード先
  onSuccess: () => void; // アップロード成功時
  onError: (error: unknown) => void; // アップロード失敗時
}

const UploadFile = ({
  file,
  keyPrefix,
  onSuccess,
  onError,
}: UploadFileProps) => {
  const handleUpload = async () => {
    try {
      await uploadFileToS3(file, keyPrefix);
      onSuccess();
      toast({
        title: "Upload successful",
        description: `File ${file.name} has been uploaded to S3.`,
      });
    } catch (error) {
      console.error("Upload error:", error);
      onError(error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your file to S3.",
        variant: "destructive",
      });
    }
  };

  return (
    <button
      onClick={handleUpload}
      className="rounded bg-blue-500 px-4 py-2 text-white"
    >
      Upload {file.name}
    </button>
  );
};

export default UploadFile;
