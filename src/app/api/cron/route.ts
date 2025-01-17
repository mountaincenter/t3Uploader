import { NextResponse } from "next/server";

export async function GET(req: Request) {
  // 認証ヘッダーの検証
  const authHeader = req.headers.get("Authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  // 認証成功後の処理
  const currentTime = new Date().toISOString();
  console.log(`[CRON JOB] Current Time: ${currentTime}`);
  return NextResponse.json({ message: "Cron job executed", time: currentTime });
}
