import React from "react";
import { HydrateClient } from "@/trpc/server";
import FileViewer from "@/app/components/files/FileViewer";
import FileUploader from "@/app/components/files/FileUploader";
import FileLists from "@/app/components/files/FileList";

export default async function Home() {
  return (
    <HydrateClient>
      <main className="container mx-auto space-y-8 p-4">
        <h1 className="text-2xl font-bold">File Uploader and Viewer</h1>
        <section>
          <h2 className="mb-4 text-xl font-semibold">Upload File</h2>
          <FileUploader />
        </section>
        <section>
          <h2 className="mb-4 text-xl font-semibold">View File</h2>
          <FileViewer />
        </section>
        <FileLists></FileLists>
      </main>
    </HydrateClient>
  );
}
