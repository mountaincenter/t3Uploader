import { z } from "zod";

// ファイルのスキーマ
const fileSchema = z.object({
  size: z.number().max(10 * 1024 * 1024, "File size must not exceed 10MB."),
  name: z.string(),
  type: z.enum(["image/jpeg", "image/png", "application/pdf"]),
});

// 配列のスキーマ: 4枚上限を追加
const filesSchema = z
  .array(fileSchema)
  .max(4, "You can upload up to 4 files at once.");

// 検証関数
export const validateFiles = (files: File[]) => {
  const errors: string[] = [];
  let validFiles: File[] = [];

  // 配列全体を検証
  const result = filesSchema.safeParse(
    files.map((file) => ({
      size: file.size,
      name: file.name,
      type: file.type,
    })),
  );

  if (result.success) {
    validFiles = files; // 配列全体が有効ならそのまま設定
  } else {
    // エラー情報を収集
    result.error.errors.forEach((error) => {
      errors.push(error.message);
    });
  }

  return { validFiles, errors };
};
