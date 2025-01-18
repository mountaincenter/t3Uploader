"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import type { FileType } from "@prisma/client";
import FileDetailViewer from "@/app/components/files/FileDetailViewer";

interface DialogViewerProps {
  isOpen: boolean;
  onClose: () => void;
  originalUrl: string | null;
  thumbnailUrl: string | null;
  fileType: FileType;
  isLoading: boolean; // ローディング状態
}

const DialogViewer: React.FC<DialogViewerProps> = ({
  isOpen,
  onClose,
  originalUrl,
  thumbnailUrl,
  fileType,
  isLoading,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>File Viewer</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-96 w-full rounded-md" />
          </div>
        ) : (
          <FileDetailViewer
            originalUrl={originalUrl}
            thumbnailUrl={thumbnailUrl}
            fileType={fileType}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DialogViewer;
