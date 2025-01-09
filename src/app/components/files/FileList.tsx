"use client";

import React from "react";
import { useFileMutation } from "@/app/components/hooks/useFileMutation";
import FileDetail from "@/app/components/files/FileDetail";

const FileList = () => {
  const { files, isLoading } = useFileMutation();

  if (isLoading) {
    return <p className="text-center text-gray-500">Loading files...</p>;
  }

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
