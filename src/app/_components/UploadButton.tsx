"use client";

import { uploadFileToS3 } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface UploadButtonProps {
  file: File;
  thumbnailFile?: File | null;
  onUploadComplete: () => void; // アップロード完了時のリセット
}

const UploadButton = ({
  file,
  thumbnailFile,
  onUploadComplete,
}: UploadButtonProps) => {
  const handleUpload = async () => {
    const timestamp = Date.now().toString();

    try {
      // オリジナルファイルのアップロード
      await uploadFileToS3(file, "uploads/original", timestamp);
      toast({
        title: "Original Upload Successful",
        description: `Original file "${file.name}" uploaded successfully.`,
      });

      // サムネイルファイルがある場合のみアップロード
      if (thumbnailFile) {
        await uploadFileToS3(thumbnailFile, "uploads/thumbnail", timestamp);
        toast({
          title: "Thumbnail Upload Successful",
          description: `Thumbnail "${thumbnailFile.name}" uploaded successfully.`,
        });
      }

      onUploadComplete(); // 入力のリセット
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your files to S3.",
        variant: "destructive",
      });
    }
  };

  return <Button onClick={handleUpload}>Upload to S3</Button>;
};

export default UploadButton;
