"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useFileMutation } from "@/app/components/hooks/useFileMutation";
import { useSelectedFile } from "@/app/components/hooks/useSelectedFile";
import { Button } from "@/components/ui/button";
import DeleteButton from "@/app/components/DeleteButton";
import FileViewer from "@/app/components/files/FileDetailViewer";

const FileDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const fileId = Array.isArray(params.id) ? params.id[0] : params.id;

  const { files, isLoading: isFilesLoading } = useFileMutation(); // ファイルリストを取得
  const { file, isLoading: isFileLoading, setSelectedFile } = useSelectedFile(); // 選択ファイル

  useEffect(() => {
    if (fileId) {
      const selectedFile = files?.find((f) => f.id === fileId);
      if (selectedFile) {
        setSelectedFile(selectedFile);
      }
    }
  }, [fileId, files, setSelectedFile]);

  if (isFilesLoading || isFileLoading) {
    return <p className="text-center text-gray-500">Loading file...</p>;
  }

  if (!file) {
    return <p className="text-center text-red-500">File not found.</p>;
  }

  return (
    <div className="container mx-auto max-w-6xl rounded-lg bg-white p-6 shadow-lg">
      <h1 className="mb-6 text-3xl font-extrabold tracking-tight text-gray-800">
        {file.originalUrl?.split("/").pop() ??
          file.thumbnailUrl?.split("/").pop()}
      </h1>
      <div className="flex items-center justify-center">
        <FileViewer
          originalUrl={file.originalUrl}
          thumbnailUrl={file.thumbnailUrl}
          fileType={file.type}
          width="600px" // 任意の幅を指定
          height="700px" // 任意の高さを指定
        />
      </div>
      <div className="mt-6 flex justify-center gap-4">
        <Button
          variant="outline"
          className="px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          onClick={() => window.history.back()}
        >
          Go Back
        </Button>
        <DeleteButton
          fileId={file.id}
          originalKey={`uploads/original/${file.originalUrl?.split("/").pop()}`}
          thumbnailKey={
            file.thumbnailUrl
              ? `uploads/thumbnail/${file.thumbnailUrl.split("/").pop()}`
              : null
          }
          onDeleted={() => router.push("/")} // 削除後にリダイレクト
        />
      </div>
    </div>
  );
};

export default FileDetailPage;
