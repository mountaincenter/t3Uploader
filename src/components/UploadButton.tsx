"use client";

import { uploadFileToS3 } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useFileMutation } from "@/app/hooks/useFileMutation";

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
  const { createFile } = useFileMutation();

  const handleUpload = async () => {
    const timestamp = Date.now().toString();
    const keyPrefixOriginal = "uploads/original";
    const keyPrefixThumbnail = "uploads/thumbnail";

    try {
      // オリジナルファイルのアップロード
      const originalKey = `${keyPrefixOriginal}/${timestamp}-${file.name}`;
      await uploadFileToS3(file, keyPrefixOriginal, timestamp);
      toast({
        title: "Original Upload Successful",
        description: `Original file "${file.name}" uploaded successfully.`,
      });

      // サムネイルファイルがある場合のみアップロード
      let thumbnailKey: string | undefined = undefined;
      if (thumbnailFile) {
        thumbnailKey = `${keyPrefixThumbnail}/${timestamp}-${thumbnailFile.name}`;
        await uploadFileToS3(thumbnailFile, keyPrefixThumbnail, timestamp);
        toast({
          title: "Thumbnail Upload Successful",
          description: `Thumbnail "${thumbnailFile.name}" uploaded successfully.`,
        });
      }

      // データベースに登録
      const fileType = file.type === "application/pdf" ? "PDF" : "JPEG"; // ファイルタイプを判別
      await createFile(originalKey, fileType, thumbnailKey);

      toast({
        title: "File Registered",
        description: "File information has been successfully registered.",
      });

      // 入力のリセット
      onUploadComplete();
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload Failed",
        description:
          "There was an error uploading your files or registering them in the database.",
        variant: "destructive",
      });
    }
  };

  return <Button onClick={handleUpload}>Upload to S3 and Register</Button>;
};

export default UploadButton;
