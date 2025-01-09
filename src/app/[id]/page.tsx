"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useFileMutation } from "@/app/components/hooks/useFileMutation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import DeleteButton from "@/app/components/DeleteButton";

const FileDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const fileId = Array.isArray(params.id) ? params.id[0] : params.id;

  const { file, setSelectedFile, isLoading, files } = useFileMutation();

  // fileIdを元にファイルを取得して設定
  useEffect(() => {
    if (fileId) {
      const selectedFile = files?.find((f) => f.id === fileId); // filesリストから検索
      if (selectedFile) {
        setSelectedFile(selectedFile); // 完全な型のデータを渡す
      }
    }
  }, [fileId, files, setSelectedFile]);

  if (isLoading) {
    return <p className="text-center text-gray-500">Loading file...</p>;
  }

  if (!file) {
    return <p className="text-center text-red-500">File not found.</p>;
  }

  return (
    <div className="container mx-auto max-w-4xl rounded-lg bg-white p-6 shadow-lg">
      <h1 className="mb-6 text-3xl font-extrabold tracking-tight text-gray-800">
        {file.originalUrl?.split("/").pop()}
      </h1>
      <div className="mb-6 flex justify-center">
        {file.type === "PDF" ? (
          <iframe
            src={file.originalUrl!}
            className="h-[600px] w-full rounded-md border border-gray-300 shadow-sm"
            title="PDF Viewer"
          />
        ) : (
          <Image
            src={file.originalUrl!}
            alt="Original File"
            width={600}
            height={600}
            className="rounded-md shadow-lg"
          />
        )}
      </div>
      <div className="flex justify-center gap-4">
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
