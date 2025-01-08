"use client";

import { useState, useRef } from "react";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

const FileUploader = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null); // input要素を参照するためのuseRef

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    try {
      const s3Client = new S3Client({
        region: process.env.NEXT_PUBLIC_AWS_REGION,
        credentials: {
          accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
          secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!,
        },
        forcePathStyle: true,
      });

      const params = {
        Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
        Key: `uploads/${Date.now()}-${file.name}`,
        Body: file,
        ContentType: file.type,
      };

      console.log("Uploading with params:", {
        ...params,
        Body: "File content (not logged)",
        Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
      });

      const command = new PutObjectCommand(params);
      const response = await s3Client.send(command);

      console.log("Upload response:", response);

      toast({
        title: "File uploaded successfully",
        description: `File ${file.name} has been uploaded to S3.`,
      });
    } catch (error) {
      console.error("Upload error:", error);
      let errorMessage = "There was an error uploading your file to S3.";

      if (error instanceof Error) {
        errorMessage += ` Error: ${error.message}`;
      }

      toast({
        title: "Upload failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setFile(null);

      // Inputタグをクリア
      if (inputRef.current) {
        inputRef.current.value = ""; // inputの値をリセット
      }
    }
  };

  return (
    <div className="space-y-4">
      <Input
        type="file"
        onChange={handleFileChange}
        ref={inputRef} // input要素を参照
        disabled={uploading}
      />
      <Button onClick={handleUpload} disabled={!file || uploading}>
        {uploading ? "Uploading..." : "Upload to S3"}
      </Button>
    </div>
  );
};

export default FileUploader;
