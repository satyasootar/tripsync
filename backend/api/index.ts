// We point Vercel's auto-compiler to the bundled esbuild output
// This bypasses path alias errors and ESM/CJS conflicts in Vercel's native builder.
import app from "../dist/index.js";

// Vercel serverless function entry point
export default app;
