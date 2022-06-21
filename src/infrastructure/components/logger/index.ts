import { createLogger, transports, format, Logform } from "winston";

const context = "Components.Logger";

export const logger = createLogger({
  exitOnError: true,
  level: "info",
  transports: [new transports.Console()],
  defaultMeta: {
    service_name: "tiket-mobile"
  }
});

export function consoleFormatter(info: Logform.TransformableInfo): string {
  return `${info.timestamp} - ${info.level} : ${info.message}`;
}

export function getConsoleFormatter() {
  return format.combine(
    format.timestamp({ format: "YYYY-MM-DD hh:mm:ss" }),
    format.colorize(),
    format.printf(consoleFormatter)
  );
}

export function initialization(): void {
  const scope = initialization.name;

  logger.clear();
  logger.add(new transports.Console({ format: getConsoleFormatter() }));

  info(context, "Logging infrastructure initialization", scope);
}

export function sanitizeData(data: any): string {
  if (!data) {
    return "";
  }

  if (typeof data === "string") {
    return data;
  }

  return JSON.stringify(data);
}

export function error(
  context: string,
  message: string,
  scope: string,
  data?: any
): void {
  logger.error(message, { context, scope, data: sanitizeData(data) });
}

export function info(
  context: string,
  message: string,
  scope: string,
  data?: any
): void {
  logger.info(message, { context, scope, data: sanitizeData(data) });
}
