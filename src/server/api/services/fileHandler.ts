import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const fileHandler = {
  // ファイル一覧を取得
  getFileLists: async () => {
    try {
      return await prisma.file.findMany();
    } catch (error) {
      console.error("Error fetching file lists:", error);
      throw new Error("Could not fetch file lists");
    }
  },

  // 個別のファイル情報を取得
  getFileById: async (id: string) => {
    try {
      return await prisma.file.findUnique({
        where: { id },
      });
    } catch (error) {
      console.error("Error fetching file:", error);
      throw new Error("Could not fetch file");
    }
  },

  // ファイルレコードの作成
  createFile: async (
    key: string,
    type: "JPEG" | "PNG" | "PDF",
    thumbnailKey?: string,
  ) => {
    try {
      const originalUrl = `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${key}`;
      const thumbnailUrl = thumbnailKey
        ? `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${thumbnailKey}`
        : null;

      // データベースにファイル情報を保存
      return await prisma.file.create({
        data: {
          originalUrl,
          thumbnailUrl,
          type,
        },
      });
    } catch (error) {
      console.error("Error creating file record:", error);
      throw new Error("Could not create file record");
    }
  },

  // データベースからファイルを削除
  deleteFile: async (id: string) => {
    try {
      return await prisma.file.delete({
        where: { id },
      });
    } catch (error) {
      console.error("Error deleting file:", error);
      throw new Error("Could not delete file");
    }
  },
};
