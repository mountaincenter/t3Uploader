"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import type { File } from "@prisma/client";

export const useSelectedFile = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { data: file, isLoading } = api.file.getFileById.useQuery(
    { id: selectedFile?.id ?? "" },
    {
      enabled: !!selectedFile?.id,
    },
  );

  return { file, isLoading, setSelectedFile };
};
