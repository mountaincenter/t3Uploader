"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { FileText, File } from "lucide-react";
import DeleteButton from "../../components/DeleteButton"; // DeleteButtonをインポート
import type { File as FileType } from "@prisma/client";

interface FileListProps {
  file: FileType;
}

const FileList: React.FC<FileListProps> = ({ file }) => {
  return (
    <li className="rounded-lg border border-gray-200 bg-white p-4 shadow transition-shadow hover:shadow-md">
      <div className="space-y-2">
        {/* Thumbnail or Icon */}
        {file.thumbnailUrl && file.type !== "PDF" ? (
          <Image
            src={file.thumbnailUrl}
            alt="Thumbnail"
            width={150}
            height={150}
            className="mx-auto cursor-pointer rounded"
          />
        ) : (
          <div className="flex h-36 items-center justify-center rounded bg-gray-100 text-gray-500">
            {file.type === "PDF" ? <FileText size={40} /> : <File size={40} />}
          </div>
        )}

        {/* File Name */}
        <div className="text-center">
          <p className="truncate text-sm text-gray-700">
            {file.originalUrl?.split("/").pop()}
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => (window.location.href = `/${file.id}`)} // 動的ルーティング
          >
            View
          </Button>
          <DeleteButton
            fileId={file.id}
            originalKey={`uploads/original/${file.originalUrl?.split("/").pop()}`}
            thumbnailKey={
              file.thumbnailUrl
                ? `uploads/thumbnail/${file.thumbnailUrl.split("/").pop()}`
                : null
            }
          />
        </div>
      </div>
    </li>
  );
};

export default FileList;
