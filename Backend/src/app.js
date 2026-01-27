import express from "express"
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

//import routes
import userRoutes from "./routes/user.routes.js";
import boardRoutes from "./routes/board.routes.js";
import workspaceRoutes from "./routes/workspace.routes.js";
import taskRoutes from "./routes/task.routes.js";

//routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/boards", boardRoutes);
app.use("/api/v1/workspaces", workspaceRoutes);
app.use("/api/v1/tasks", taskRoutes)

export default app