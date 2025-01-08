"use client";

import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { deleteFileToS3 } from "@/lib/utils";
import { useFileMutation } from "@/app/hooks/useFileMutation";

interface DeleteButtonProps {
  fileId: string;
  originalKey: string;
  thumbnailKey?: string | null;
  onDeleted?: () => void; // 削除成功後のコールバック
}

const DeleteButton = ({
  fileId,
  originalKey,
  thumbnailKey,
  onDeleted,
}: DeleteButtonProps) => {
  const { deleteFile } = useFileMutation();

  const handleDelete = async () => {
    try {
      // S3のオリジナルファイルを削除
      await deleteFileToS3(originalKey);
      toast({
        title: "Original File Deleted",
        description: "The original file has been successfully deleted from S3.",
      });

      // S3のサムネイルファイルを削除（存在する場合のみ）
      if (thumbnailKey) {
        await deleteFileToS3(thumbnailKey);
        toast({
          title: "Thumbnail File Deleted",
          description:
            "The thumbnail file has been successfully deleted from S3.",
        });
      }

      // データベースから削除
      await deleteFile(fileId);
      toast({
        title: "File Deleted",
        description:
          "File information has been successfully removed from the database.",
      });

      // 削除後のコールバック
      onDeleted?.();
    } catch (error) {
      console.error("Delete error:", error);
      toast({
        title: "Delete Failed",
        description: "There was an error deleting the file.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button variant="destructive" size="sm" onClick={handleDelete}>
      Delete
    </Button>
  );
};

export default DeleteButton;
