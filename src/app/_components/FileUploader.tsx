"use client";

import { useState, useRef } from "react";
import { generateThumbnail } from "@/lib/utils";
import UploadButton from "./UploadButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import Image from "next/image";

const FileUploader = () => {
  const [file, setFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleConvert = async () => {
    if (
      !file?.type.startsWith("image/jpeg") &&
      !file?.type.startsWith("image/png")
    )
      return;

    try {
      const thumbnail = await generateThumbnail(file, 100); // サムネイル生成
      setThumbnailFile(thumbnail);

      toast({
        title: "Thumbnail Generated",
        description: "Thumbnail image has been successfully generated.",
      });
    } catch (error) {
      console.error("Thumbnail generation error:", error);
      toast({
        title: "Error",
        description: "Failed to generate thumbnail.",
        variant: "destructive",
      });
    }
  };

  const resetInputs = () => {
    setFile(null);
    setThumbnailFile(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="space-y-4">
      <Input type="file" onChange={handleFileChange} ref={inputRef} />
      <div className="flex gap-4">
        <Button
          onClick={handleConvert}
          disabled={!file?.type.startsWith("image/")}
        >
          Convert Thumbnail
        </Button>
        {file && (
          <UploadButton
            file={file}
            thumbnailFile={thumbnailFile}
            onUploadComplete={resetInputs}
          />
        )}
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
