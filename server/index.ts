import express, { type Request, Response, NextFunction } from "express";
import { createServer } from "http";
import { registerRoutes } from "./routes";
import { setupAuth } from "./auth";
import { setupVite, serveStatic, log } from "./vite";
import helmet from "helmet";

const app = express();

// Configure security headers with helmet
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https:"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", "wss:", "https://login.microsoftonline.com"],
        fontSrc: ["'self'", "https:", "data:"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'self'", "https://login.microsoftonline.com"],
      },
    },
    crossOriginEmbedderPolicy: false, // Required for development
    crossOriginResourcePolicy: { policy: "cross-origin" }, // Required for development
  })
);

// Add additional security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Initialize auth
const passport = setupAuth(app);

// Logging middleware for API routes
app.use((req, res, next) => {
  if (!req.path.startsWith('/api')) {
    return next();
  }

  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
    if (capturedJsonResponse) {
      logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
    }

    if (logLine.length > 80) {
      logLine = logLine.slice(0, 79) + "…";
    }

    log(logLine);
  });

  next();
});

(async () => {
  const server = createServer(app);

  // Setup API routes
  const apiRouter = express.Router();
  apiRouter.use((_req, res, next) => {
    res.type('application/json');
    next();
  });

  registerRoutes(apiRouter);
  app.use("/api", apiRouter);

  // API error handlers for /api routes only
  app.use("/api", (err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error("API Error:", err);
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
  });

  // API 404 handler for /api routes
  app.use("/api/*", (_req: Request, res: Response) => {
    res.status(404).json({ message: "API endpoint not found" });
  });

  // Frontend setup
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Start server
  const PORT = 5000;
  server.listen(PORT, "0.0.0.0", () => {
    log(`Server started on port ${PORT}`);
  });
})();