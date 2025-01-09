import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { fileHandler } from "../services/fileHandler";

export const fileRouter = createTRPCRouter({
  // ファイルのアップロード情報をデータベースに登録
  createFile: publicProcedure
    .input(
      z.object({
        key: z.string(), // S3のオリジナルファイルのキー
        type: z.enum(["JPEG", "PNG", "PDF"]), // ファイルタイプ
        thumbnailKey: z.string().optional(), // サムネイルのキー（画像の場合のみ）
      }),
    )
    .mutation(async ({ input }) => {
      const { key, type, thumbnailKey } = input;
      await fileHandler.createFile(key, type, thumbnailKey);
      return { success: true };
    }),

  // ファイルリストを取得
  getFileLists: publicProcedure.query(async () => {
    return await fileHandler.getFileLists();
  }),

  // 個別のファイル情報を取得
  getFileById: publicProcedure
    .input(z.object({ id: z.string() })) // ファイルIDを入力
    .query(async ({ input }) => {
      return await fileHandler.getFileById(input.id);
    }),

  // ファイルを削除（データベースからのみ）
  deleteFile: publicProcedure
    .input(z.object({ id: z.string() })) // ファイルIDを入力
    .mutation(async ({ input }) => {
      await fileHandler.deleteFile(input.id);
      return { success: true };
    }),
});
