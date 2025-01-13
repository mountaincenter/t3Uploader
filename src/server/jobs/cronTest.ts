import cron from "node-cron";

cron.schedule("*/1 * * * *", () => {
  console.log("Cron job is running every 1 minutes...");
});
