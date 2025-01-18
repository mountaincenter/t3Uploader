"use client";

import React from "react";
import { useFileMutation } from "@/app/components/hooks/useFileMutation";
import FileDetail from "@/app/components/files/FileDetail";
import { Skeleton } from "@/components/ui/skeleton";

const FileList = () => {
  const { files, isLoading } = useFileMutation();

  if (isLoading) {
    const skeletonCount = Math.min(files?.length ?? 8, 8); // 最大8件表示
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-700">File Lists</h2>
        <ul className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: skeletonCount }).map((_, index) => (
            <li key={index} className="rounded-lg border bg-white p-4 shadow">
              <div className="space-y-4">
                <Skeleton className="h-36 w-full rounded-md" />
                <Skeleton className="mx-auto h-4 w-3/4 rounded" />
                <div className="flex justify-center gap-2">
                  <Skeleton className="h-8 w-20 rounded" />
                  <Skeleton className="h-8 w-20 rounded" />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  // 通常のリスト表示
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-700">File Lists</h2>
      {files?.length ? (
        <ul className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {files.map((file) => (
            <FileDetail key={file.id} file={file} />
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500">No files uploaded yet.</p>
      )}
    </div>
  );
};

export default FileList;
