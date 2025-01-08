"use client";

import { useState, useRef } from "react";
import { generateThumbnail, uploadFileToS3 } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import Image from "next/image";

const FileUploader = () => {
  const [file, setFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleConvert = async () => {
    if (!file?.type.startsWith("image/")) return; // Lint対応済み

    try {
      const timestamp = Date.now().toString(); // オリジナル用タイムスタンプ
      const originalFileName = `${timestamp}-${file.name}`;

      // サムネイル生成時にタイムスタンプを渡す
      const thumbnail = await generateThumbnail(file, timestamp, 100);
      setThumbnailFile(thumbnail);

      // オリジナルファイル名をセット
      setFile(new File([file], originalFileName, { type: file.type }));
    } catch (error) {
      console.error("Thumbnail generation error:", error);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);

    try {
      // オリジナルファイルをアップロード
      await uploadFileToS3(file, "uploads/original");
      toast({
        title: "Upload Successful",
        description: `Original file "${file.name}" uploaded successfully.`,
      });

      // サムネイルファイルがある場合のみアップロード
      if (thumbnailFile) {
        await uploadFileToS3(thumbnailFile, "uploads/thumbnail");
        toast({
          title: "Thumbnail Upload Successful",
          description: `Thumbnail "${thumbnailFile.name}" uploaded successfully.`,
        });
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your files to S3.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setFile(null);
      setThumbnailFile(null);
      if (inputRef.current) inputRef.current.value = ""; // Inputをリセット
    }
  };

  return (
    <div className="space-y-4">
      <Input
        type="file"
        onChange={handleFileChange}
        ref={inputRef}
        disabled={uploading}
      />
      <div className="flex gap-4">
        <Button
          onClick={handleConvert}
          disabled={!file || uploading || !file?.type.startsWith("image/")}
        >
          Convert Thumbnail
        </Button>
        <Button onClick={handleUpload} disabled={!file || uploading}>
          {uploading ? "Uploading..." : "Upload to S3"}
        </Button>
      </div>
      {file && (
        <div>
          <p>Original File: {file.name}</p>
          {file.type.startsWith("image/") ? (
            <Image
              src={URL.createObjectURL(file)}
              alt="Original"
              width={300}
              height={300}
            />
          ) : (
            <p>PDF File: {file.name}</p>
          )}
        </div>
      )}
      {thumbnailFile && (
        <div>
          <p>Thumbnail File: {thumbnailFile.name}</p>
          <Image
            src={URL.createObjectURL(thumbnailFile)}
            alt="Thumbnail"
            width={100}
            height={100}
          />
        </div>
      )}
    </div>
  );
};

export default FileUploader;
