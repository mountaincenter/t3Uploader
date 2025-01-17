"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { FileText, File as FileIcon } from "lucide-react";
import DeleteButton from "../DeleteButton"; // DeleteButtonをインポート
import DialogDetailViewer from "./DialogViewer"; // DialogViewerをインポート
import type { File as FileType } from "@prisma/client";

interface FileDetailProps {
  file: FileType;
}

const FileDetail: React.FC<FileDetailProps> = ({ file }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
            onClick={() => setIsDialogOpen(true)} // Dialogを開く
          />
        ) : (
          <div
            className="flex h-36 cursor-pointer items-center justify-center rounded bg-gray-100 text-gray-500"
            onClick={() => setIsDialogOpen(true)} // Dialogを開く
          >
            {file.type === "PDF" ? (
              <FileText size={40} />
            ) : (
              <FileIcon size={40} />
            )}
          </div>
        )}

        {/* File Name */}
        <div className="text-center">
          <p className="truncate text-sm text-gray-700">
            {file.originalUrl
              ? file.originalUrl.split("/").pop()
              : file.thumbnailUrl?.split("/").pop()}
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => (window.location.href = `/${file.id}`)} // [id]/page.tsxへのルーティング
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

      {/* DialogViewer */}
      <DialogDetailViewer
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)} // Dialogを閉じる
        originalUrl={file.originalUrl}
        thumbnailUrl={file.thumbnailUrl}
        fileType={file.type}
      />
    </li>
  );
};

export default FileDetail;
