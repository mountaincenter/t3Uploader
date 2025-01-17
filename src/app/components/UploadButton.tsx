"use client";

import { uploadFileToS3 } from "@/lib/s3";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useFileMutation } from "@/app/components/hooks/useFileMutation";

interface UploadButtonProps {
  files: File[];
  thumbnails: Map<string, File | null>;
  onUploadComplete: () => void; // アップロード完了時のリセット
}

const UploadButton = ({
  files,
  thumbnails,
  onUploadComplete,
}: UploadButtonProps) => {
  const { createFile } = useFileMutation();

  const handleUploadAll = async () => {
    if (files.length === 0) {
      toast({
        title: "No Files Selected",
        description: "Please select files to upload.",
        variant: "destructive",
      });
      return;
    }

    try {
      const timestamp = Date.now().toString();
      const keyPrefixOriginal = "uploads/original";
      const keyPrefixThumbnail = "uploads/thumbnail";

      for (const file of files) {
        // オリジナルファイルのアップロード
        const originalKey = `${keyPrefixOriginal}/${timestamp}-${file.name}`;
        await uploadFileToS3(file, keyPrefixOriginal, timestamp);
        toast({
          title: "Original Upload Successful",
          description: `Original file "${file.name}" uploaded successfully.`,
        });

        // サムネイルファイルがある場合のみアップロード
        const thumbnail = thumbnails.get(file.name);
        let thumbnailKey: string | undefined;
        if (thumbnail) {
          thumbnailKey = `${keyPrefixThumbnail}/${timestamp}-${thumbnail.name}`;
          await uploadFileToS3(thumbnail, keyPrefixThumbnail, timestamp);
          toast({
            title: "Thumbnail Upload Successful",
            description: `Thumbnail "${thumbnail.name}" uploaded successfully.`,
          });
        }

        // データベース登録
        const fileType = file.type === "application/pdf" ? "PDF" : "JPEG";
        await createFile(originalKey, fileType, thumbnailKey);

        toast({
          title: "File Registered",
          description: `File "${file.name}" registered successfully.`,
        });
      }

      onUploadComplete();
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your files.",
        variant: "destructive",
      });
    }
  };

  return <Button onClick={handleUploadAll}>Upload All Files</Button>;
};

export default UploadButton;
