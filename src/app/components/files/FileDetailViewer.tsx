"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ImageOff, FileWarning } from "lucide-react";
import type { FileType } from "@prisma/client";

interface FileViewerProps {
  originalUrl: string | null;
  thumbnailUrl: string | null;
  fileType: FileType;
  width?: string; // 可変幅
  height?: string; // 可変高さ
}

const FileDetailViewer: React.FC<FileViewerProps> = ({
  originalUrl,
  thumbnailUrl,
  fileType,
  width = "100%", // デフォルト幅
  height = "600px", // デフォルト高さ
}) => {
  const [hasError, setHasError] = useState(false);
  const [pdfError, setPdfError] = useState(false);

  const fileUrl = hasError || !originalUrl ? thumbnailUrl : originalUrl;

  return (
    <div className="text-center">
      {fileType === "PDF" ? (
        !pdfError ? (
          <iframe
            src={fileUrl ?? ""}
            className={`rounded-md border border-gray-300 shadow-sm`}
            style={{
              width: width,
              height: height,
            }}
            title="PDF Viewer"
            onError={() => setPdfError(true)}
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-4">
            <FileWarning className="text-red-500" size={48} />
            <p className="mt-4 text-sm text-gray-500">PDF cannot be loaded</p>
          </div>
        )
      ) : fileUrl ? (
        <Image
          src={fileUrl}
          alt="File Viewer"
          width={800}
          height={600}
          className="rounded-md shadow-lg"
          onError={() => setHasError(true)}
        />
      ) : (
        <div className="flex flex-col items-center justify-center p-4">
          <ImageOff className="text-gray-500" size={48} />
          <p className="mt-4 text-sm text-gray-500">Image not available</p>
        </div>
      )}
      {!originalUrl && thumbnailUrl && (
        <p className="mt-4 text-sm text-gray-500">サムネイルのみの表示です</p>
      )}
    </div>
  );
};

export default FileDetailViewer;
