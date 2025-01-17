import { NextResponse } from "next/server";
import { fileHandler } from "@/server/api/services/fileHandler"; // ファイルハンドラー
import { deleteFileToS3 } from "@/lib/s3"; // S3削除関数
import { AWS_CONFIG } from "@/constants/awsConfig"; // AWS_CONFIGのインポート

// S3キーを抽出する関数
const extractS3Key = (url: string) => {
  return url.replace(AWS_CONFIG.bucketUrl, ""); // bucketUrlを直接参照
};

export async function GET(req: Request) {
  // 認証ヘッダーの検証
  const authHeader = req.headers.get("Authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    console.log("[CRON JOB] Starting cleanup of original files...");

    // 古いファイルをデータベースから取得
    const files = await fileHandler.getOldFilesFromDatabase();

    await Promise.all(
      files.map(async (file) => {
        try {
          if (file.originalUrl) {
            const originalKey = extractS3Key(file.originalUrl);
            await deleteFileToS3(originalKey);
            console.log(
              `[CRON JOB] Deleted original file: ${file.originalUrl}`,
            );
          }
          await fileHandler.updateFileToRemoveOriginal(file.id);
        } catch (error) {
          console.error(`[CRON JOB] Failed to delete file ${file.id}:`, error);
        }
      }),
    );

    console.log("[CRON JOB] Cleanup of original files completed.");
    return NextResponse.json({ message: "Cron job executed successfully." });
  } catch (error) {
    console.error("[CRON JOB] Error during cleanup:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
