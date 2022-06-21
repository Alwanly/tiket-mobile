import { Server } from "http";

import * as express from "express";
import * as Logger from "./infrastructure/components/logger";
const context = "App.server";

async function registerApis(): Promise<express.Application> {
  const app: express.Application = express.default();

  app.get("/tiket", (req, res) => res.send("running properly"));

  return app;
}

let server: Server;

// clean up and graceful shutdown
async function handleShutdown(): Promise<void> {
  Logger.info(context, "Disposing express object...", handleShutdown.name);
  server?.close();
}

// setup graceful exit when receiving OS termination signal
const signalTraps: Array<NodeJS.Signals> = ["SIGTERM", "SIGINT", "SIGUSR2"];
signalTraps.forEach((signal) => {
  process.once(signal, async () => {
    try {
      Logger.error(context, "Process exit by termination signal", signal);
      await handleShutdown();
      process.exit(0);
    } finally {
      process.kill(process.pid, signal);
    }
  });
});

(async function main(): Promise<void> {
  const app = await registerApis();

  server = app.listen(8080, () => {
    Logger.info(context, "Server starded on port 8080", main.name);
  });

  Logger.info(
    context,
    "All initialization completed, app is ready to server",
    main.name
  );
})();
