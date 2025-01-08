"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";

const FileViewer = () => {
  const [url, setUrl] = useState("");
  const [fileType, setFileType] = useState<"image" | "pdf" | null>(null);
  const [showError, setShowError] = useState(false); // エラー表示用の状態
  const inputRef = useRef<HTMLInputElement | null>(null); // Inputタグを参照するためのuseRef

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    setFileType(null);
    setShowError(false); // URLが変更されたらエラーをリセット
  };

  const handleView = () => {
    const lowerCaseUrl = url.toLowerCase();
    if (
      lowerCaseUrl.endsWith(".jpg") ||
      lowerCaseUrl.endsWith(".jpeg") ||
      lowerCaseUrl.endsWith(".png")
    ) {
      setFileType("image");
      setShowError(false); // 正しいファイルタイプならエラーを非表示
    } else if (lowerCaseUrl.endsWith(".pdf")) {
      setFileType("pdf");
      setShowError(false); // 正しいファイルタイプならエラーを非表示
    } else {
      setFileType(null);
      setShowError(true); // 無効なファイルタイプの場合エラーを表示
    }

    // URLをリセット
    if (inputRef.current) {
      inputRef.current.value = ""; // Inputタグの値をリセット
    }
  };

  const handleClose = () => {
    setFileType(null);
    setShowError(false); // 閉じるときはエラーもリセット
    setUrl(""); // URLもリセット

    // Inputタグをリセット
    if (inputRef.current) {
      inputRef.current.value = ""; // Inputタグの値をクリア
    }
  };

  return (
    <div className="space-y-4">
      <Input
        type="text"
        placeholder="Enter file URL"
        onChange={handleUrlChange}
        ref={inputRef} // useRefをInputタグに適用
      />
      <Button onClick={handleView} disabled={!url}>
        View
      </Button>
      <div className="mt-2 flex flex-col"></div>
      {fileType === "image" && (
        <div>
          <Button onClick={handleClose}>Close</Button>
          <Image
            src={url}
            alt="Uploaded file"
            className="h-auto max-w-full"
            width={500}
            height={500}
          />
        </div>
      )}
      {fileType === "pdf" && (
        <div>
          <Button onClick={handleClose}>Close</Button>
          <iframe src={url} className="mt-2 h-[600px] w-full" />
        </div>
      )}
      {showError && (
        <p className="text-red-500">
          Invalid file type. Please enter a URL for a JPEG/PNG or PDF file.
        </p>
      )}
    </div>
  );
};

export default FileViewer;
