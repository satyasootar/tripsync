import app from "./src/app";
import prisma from "./src/config/database";
import { logger } from "./src/utils/logger";

const PORT = process.env.PORT || 8000;

if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
  const startServer = async () => {
    try {
      await prisma.$connect();
      logger.info("Connected to database successfully");
      app.listen(PORT, () => {
        logger.info(`🚀 Server running on http://localhost:${PORT}`);
      });
    } catch (error) {
      logger.error("Failed to start server:", error);
      process.exit(1);
    }
  };
  startServer();
}

export default app;