/**
 * Module: server.js
 * Responsibility: Process entry point that starts the HTTP server and handles graceful shutdown.
 *
 * Key Resource Safety Notes:
 * - The PostgreSQL pool is explicitly closed on shutdown to prevent leaked DB sockets.
 * - The HTTP server is closed on shutdown to stop accepting new connections.
 *
 * Time/Space Complexity:
 * - Startup logic is O(1) time and O(1) space.
 */
import { createApp } from "./app.js";
import { closePool } from "./config/db.js";

// Reads the port from environment and falls back to a safe default for local development.
const PORT = Number(process.env.PORT ?? 4000);

// Creates the configured Express application.
const app = createApp();

// Starts listening for incoming HTTP requests.
const server = app.listen(PORT, () => {
  console.log(`Backend API running on http://localhost:${PORT}`);
});

/**
 * Gracefully closes server and DB pool.
 *
 * @param {string} signal - The OS signal that triggered shutdown.
 * @returns {Promise<void>}
 *
 * Time Complexity: O(1)
 * Space Complexity: O(1)
 */
async function shutdown(signal) {
  console.log(`Received ${signal}. Starting graceful shutdown...`);

  // Stops accepting new HTTP requests. Existing open requests are allowed to finish.
  server.close(async () => {
    try {
      // Closes all idle and active PostgreSQL pool clients to prevent connection leaks.
      await closePool();
      console.log("Shutdown complete.");
      process.exit(0);
    } catch (error) {
      console.error("Error during shutdown:", error);
      process.exit(1);
    }
  });
}

// Handles Ctrl+C in terminal.
process.on("SIGINT", () => {
  void shutdown("SIGINT");
});

// Handles termination signal in container orchestration environments.
process.on("SIGTERM", () => {
  void shutdown("SIGTERM");
});
