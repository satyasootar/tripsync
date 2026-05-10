import app from "./app";
import { logger } from "@/utils/logger";
import prisma from "@/config/database";

const PORT = process.env.PORT || 8000;

async function startServer() {
  try {
    // Test database connection
    await prisma.$connect();
    logger.info("Connected to database successfully");

    app.listen(PORT, () => {
      logger.info(`🚀 Server running on http://localhost:${PORT}`);
      logger.info(`📖 API Documentation: http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
