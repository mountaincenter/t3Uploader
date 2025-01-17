"use client";

import { useState, useRef } from "react";
import { generateThumbnail } from "@/lib/thumbnail";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import Image from "next/image";
import { File as FileIcon } from "lucide-react";
import UploadButton from "../UploadButton";

const FilesUploader = () => {
  const [files, setFiles] = useState<File[]>([]); // 選択されたファイル
  const [thumbnails, setThumbnails] = useState<Map<string, File | null>>(
    new Map(),
  ); // サムネイル
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files ? Array.from(e.target.files) : [];

    // 一度に最大4枚の制限
    if (selectedFiles.length > 4) {
      toast({
        title: "File Limit Exceeded",
        description: "You can upload up to 4 files at once.",
        variant: "destructive",
      });
      return;
    }

    const newThumbnails = new Map<string, File | null>();

    // ファイルを処理
    for (const file of selectedFiles) {
      if (
        file.type.startsWith("image/jpeg") ||
        file.type.startsWith("image/png")
      ) {
        try {
          const thumbnail = await generateThumbnail(file, 100); // サムネイル生成
          newThumbnails.set(file.name, thumbnail);

          // コンソールに表示
          console.log("Original File:", file.name);
          console.log("Thumbnail File:", thumbnail.name);
        } catch (error) {
          console.error("Thumbnail generation error:", error);
          toast({
            title: "Error",
            description: `Failed to generate thumbnail for ${file.name}.`,
            variant: "destructive",
          });
        }
      } else if (file.type === "application/pdf") {
        newThumbnails.set(file.name, null); // PDFはサムネイル不要
        console.log("Original File:", file.name);
        console.log("Thumbnail File: (none, PDF uses icon)");
      } else {
        toast({
          title: "Unsupported File",
          description: `${file.name} is not supported.`,
          variant: "destructive",
        });
      }
    }

    setFiles(selectedFiles); // 新しい選択ファイルで上書き
    setThumbnails(newThumbnails);
  };

  const resetInputs = () => {
    setFiles([]);
    setThumbnails(new Map());
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="space-y-4">
      {/* ファイル入力 */}
      <Input
        type="file"
        multiple
        onChange={handleFileChange}
        ref={inputRef}
        accept="image/jpeg,image/png,application/pdf"
      />

      {/* ボタン類 */}
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

      {/* サムネイルまたはアイコンの表示 */}
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
