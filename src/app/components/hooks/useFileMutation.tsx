"use client";

import { api } from "@/trpc/react";
import { useState } from "react";
import type { File } from "@prisma/client";

export const useFileMutation = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // ファイルリストを取得するクエリ
  const {
    data: files,
    isLoading: isFilesLoading,
    refetch: refetchFiles,
  } = api.file.getFileLists.useQuery();

  // 個別ファイルを取得するクエリ
  const { data: file, isLoading: isFileLoading } =
    api.file.getFileById.useQuery(
      { id: selectedFile?.id ?? "" },
      {
        enabled: !!selectedFile?.id,
      },
    );

  // ファイルを作成するミューテーション
  const createFileMutation = api.file.createFile.useMutation({
    onSuccess: () => {
      void refetchFiles();
      console.log("File created successfully.");
    },
    onError: (error) => {
      console.error("Error creating file:", error);
    },
  });

  // ファイルを削除するミューテーション
  const deleteFileMutation = api.file.deleteFile.useMutation({
    onSuccess: () => {
      void refetchFiles();
      console.log("File deleted successfully.");
    },
    onError: (error) => {
      console.error("Error deleting file:", error);
    },
  });

  const createFile = async (
    key: string,
    type: "JPEG" | "PNG" | "PDF",
    thumbnailKey?: string,
  ) => {
    try {
      await createFileMutation.mutateAsync({ key, type, thumbnailKey });
    } catch (error) {
      console.error("Failed to create file:", error);
    }
  };

  const deleteFile = async (id: string) => {
    try {
      await deleteFileMutation.mutateAsync({ id });
    } catch (error) {
      console.error("Failed to delete file:", error);
    }
  };

  const isLoading = isFilesLoading || isFileLoading;

  return {
    file,
    files,
    createFile,
    deleteFile,
    isLoading,
    setSelectedFile, // 個別ファイルを選択するためのメソッド
  };
};
