import cron from "node-cron";
import { deleteFileToS3 } from "../../lib/s3"; // S3削除関数
import { fileHandler } from "../api/services/fileHandler"; // ファイルハンドラー

// URLからS3キーを抽出
const extractS3Key = (url: string) => {
  const bucketUrl = `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/`;
  return url.replace(bucketUrl, "");
};

cron.schedule("*/5 * * * *", () => {
  void (async () => {
    console.log("Running cron job: Deleting old files...");

    try {
      const files = await fileHandler.getOldFilesFromDatabase();

      for (const file of files) {
        try {
          const originalKey = extractS3Key(file.originalUrl ?? "");
          await deleteFileToS3(originalKey);

          if (file.thumbnailUrl != null) {
            const thumbnailKey = extractS3Key(file.thumbnailUrl);
            await deleteFileToS3(thumbnailKey);
          }

          await fileHandler.deleteFile(file.id);
          console.log(`Deleted file: ${file.id}`);
        } catch (error) {
          console.error(`Failed to delete file ${file.id}:`, error);
        }
      }

      console.log("Cron job completed.");
    } catch (error) {
      console.error("Error during cron job execution:", error);
    }
  })();
});
