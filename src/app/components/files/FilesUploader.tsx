"use client";

import { useState, useRef } from "react";
import { generateThumbnail } from "@/lib/thumbnail";
import { validateFiles } from "@/lib/validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import Image from "next/image";
import { File as FileIcon } from "lucide-react";
import UploadButton from "../UploadButton";

const FilesUploader = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [thumbnails, setThumbnails] = useState<Map<string, File | null>>(
    new Map(),
  );
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files ? Array.from(e.target.files) : [];
    const { validFiles, errors } = validateFiles(selectedFiles);

    if (errors.length > 0) {
      toast({
        title: "Validation Error",
        description: errors.join(", "),
        variant: "destructive",
      });
    }

    if (validFiles.length === 0) {
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    const newThumbnails = new Map<string, File | null>();
    for (const file of validFiles) {
      if (file.type === "image/jpeg" || file.type === "image/png") {
        try {
          const thumbnail = await generateThumbnail(file, 100);
          newThumbnails.set(file.name, thumbnail);
        } catch {
          toast({
            title: "Thumbnail Error",
            description: `Failed to generate thumbnail for ${file.name}.`,
            variant: "destructive",
          });
        }
      } else {
        newThumbnails.set(file.name, null);
      }
    }

    setFiles(validFiles);
    setThumbnails(newThumbnails);
  };

  const resetInputs = () => {
    setFiles([]);
    setThumbnails(new Map());
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="space-y-4">
      <Input
        type="file"
        multiple
        onChange={handleFileChange}
        ref={inputRef}
        accept="image/jpeg,image/png,application/pdf"
      />

      {files.length > 0 && (
        <div className="mt-4 flex gap-4">
          <Button onClick={resetInputs} variant="outline">
            Reset
          </Button>
          <UploadButton
            files={files}
            thumbnails={thumbnails}
            onUploadComplete={resetInputs}
          />
        </div>
      )}

      {files.length > 0 && (
        <div className="mt-4 space-y-4">
          <h2 className="text-lg font-bold">Files:</h2>
          <ul className="space-y-4">
            {files.map((file) => (
              <li
                key={file.name}
                className="flex items-center gap-4 rounded border p-4"
              >
                {thumbnails.get(file.name) ? (
                  <Image
                    src={URL.createObjectURL(thumbnails.get(file.name)!)}
                    alt="Thumbnail"
                    width={100}
                    height={100}
                    className="rounded"
                  />
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded bg-gray-100 text-gray-500">
                    <FileIcon size={40} />
                  </div>
                )}
                <p className="truncate text-sm">{file.name}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FilesUploader;
