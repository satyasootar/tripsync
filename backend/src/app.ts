import express, { Express } from "express";
import cors from "cors";
import helmet from "helmet";

import swaggerUi from "swagger-ui-express";
import { corsOptions } from "@/config/cors";
import { swaggerSpec } from "@/config/swagger";
import { errorMiddleware } from "@/middlewares/error.middleware";
import { ApiResponse } from "@/common/responses";

import authRoutes from "@/modules/auth/routes/auth.routes";
import usersRoutes from "@/modules/users/routes/users.routes";
import tripsRoutes from "@/modules/trips/routes/trips.routes";
import membersRoutes from "@/modules/members/routes/members.routes";
import invitesRoutes from "@/modules/invites/routes/invites.routes";
import daysRoutes from "@/modules/days/routes/days.routes";
import activitiesRoutes from "@/modules/activities/routes/activities.routes";
import commentsRoutes from "@/modules/comments/routes/comments.routes";
import checklistsRoutes from "@/modules/checklists/routes/checklists.routes";
import attachmentsRoutes from "@/modules/attachments/routes/attachments.routes";
import reservationsRoutes from "@/modules/reservations/routes/reservations.routes";
import expensesRoutes from "@/modules/expenses/routes/expenses.routes";

const app: Express = express();


// Security Middleware
app.use(helmet());
app.use(cors(corsOptions));



// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health Check
app.get("/health", (req, res) => {
  res.status(200).json(ApiResponse.success({
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV,
  }, "Server is healthy"));
});

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/trips", tripsRoutes);
app.use("/api/v1/members", membersRoutes);
app.use("/api/v1/invites", invitesRoutes);
app.use("/api/v1/days", daysRoutes);
app.use("/api/v1/activities", activitiesRoutes);
app.use("/api/v1/comments", commentsRoutes);
app.use("/api/v1/checklists", checklistsRoutes);
app.use("/api/v1/attachments", attachmentsRoutes);
app.use("/api/v1/reservations", reservationsRoutes);
app.use("/api/v1/expenses", expensesRoutes);

// Error Handling
app.use(errorMiddleware);

export default app;
