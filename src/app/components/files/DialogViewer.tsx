"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { FileType } from "@prisma/client"; // PrismaのFileTypeをインポート
import FileDetailViewer from "@/app/components/files/FileDetailViewer";

interface DialogViewerProps {
  isOpen: boolean;
  onClose: () => void;
  originalUrl: string | null;
  thumbnailUrl: string | null;
  fileType: FileType;
}

const DialogViewer: React.FC<DialogViewerProps> = ({
  isOpen,
  onClose,
  originalUrl,
  thumbnailUrl,
  fileType,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>File Viewer</DialogTitle>
        </DialogHeader>
        <FileDetailViewer
          originalUrl={originalUrl}
          thumbnailUrl={thumbnailUrl}
          fileType={fileType}
        />
      </DialogContent>
    </Dialog>
  );
};

export default DialogViewer;
