"use client";

import { uploadFileToS3 } from "@/lib/s3";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useFileMutation } from "@/app/components/hooks/useFileMutation";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

interface UploadButtonProps {
  files: File[];
  thumbnails: Map<string, File | null>;
  onUploadComplete: () => void;
}

const UploadButton = ({
  files,
  thumbnails,
  onUploadComplete,
}: UploadButtonProps) => {
  const { createFile, isLoading: isMutationLoading } = useFileMutation();
  const [uploadProgress, setUploadProgress] = useState<Map<string, number>>(
    new Map(),
  );

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
        const progressHandler = (progress: number) => {
          setUploadProgress((prev) => new Map(prev).set(file.name, progress));
        };

        // オリジナルファイルのアップロード
        const originalKey = `${keyPrefixOriginal}/${timestamp}-${file.name}`;
        await uploadFileToS3(
          file,
          keyPrefixOriginal,
          timestamp,
          progressHandler,
        );
        toast({
          title: "Original Upload Successful",
          description: `Original file "${file.name}" uploaded successfully.`,
        });

        // サムネイルファイルがある場合のみアップロード
        const thumbnail = thumbnails.get(file.name);
        let thumbnailKey: string | undefined;
        if (thumbnail) {
          thumbnailKey = `${keyPrefixThumbnail}/${timestamp}-${thumbnail.name}`;
          await uploadFileToS3(
            thumbnail,
            keyPrefixThumbnail,
            timestamp,
            progressHandler,
          );
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

  return (
    <div>
      <div>
        {isMutationLoading ? (
          <Skeleton className="h-10 w-full rounded-md" />
        ) : (
          <>
            {files.map((file) => (
              <div key={file.name} className="flex w-full items-center gap-4">
                <span
                  className="min-w-[150px] flex-grow truncate text-sm text-gray-800" // 幅を広げる
                  title={file.name} // ツールチップでフルネームを表示
                >
                  {file.name}
                </span>
                {uploadProgress.get(file.name) ? (
                  <progress
                    value={uploadProgress.get(file.name)}
                    max="100"
                    className="h-2 w-1/3 flex-shrink-0 rounded"
                  />
                ) : (
                  <Skeleton className="h-2 w-1/3 flex-shrink-0 rounded-md" />
                )}
              </div>
            ))}
            <Button onClick={handleUploadAll}>Upload All Files</Button>
          </>
        )}
      </div>
    </div>
  );
};

export default UploadButton;
