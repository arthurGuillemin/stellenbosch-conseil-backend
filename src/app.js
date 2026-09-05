import "dotenv/config";

import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import contactRoutes from "./routes/contact.routes.js";


const app = express();


/* =========================
   CORS
========================= */

const allowedOrigins = (
  process.env.FRONTEND_URLS ||
  "http://localhost:5173"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);


app.use(
  cors({
    origin(origin, callback) {

      /*
       * !origin permet par exemple
       * curl / Postman / requêtes serveur.
       */
      if (
        !origin ||
        allowedOrigins.includes(origin)
      ) {
        return callback(null, true);
      }

      return callback(
        new Error("Origine non autorisée par CORS.")
      );
    },
  })
);


/* =========================
   SÉCURITÉ
========================= */

app.use(helmet());


/* =========================
   BODY
========================= */

app.use(
  express.json({
    limit: "100kb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "100kb",
  })
);


/* =========================
   LOGGER SIMPLE
========================= */

app.use((req, res, next) => {
  console.log(
    `[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`
  );

  next();
});


/* =========================
   HEALTH CHECK
========================= */

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Stellenbosch API is running",
    environment:
      process.env.NODE_ENV || "development",
  });
});


/* =========================
   RATE LIMIT
========================= */

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  limit: 30,

  standardHeaders: true,

  legacyHeaders: false,

  message: {
    success: false,
    message:
      "Trop de requêtes. Veuillez réessayer plus tard.",
  },
});


app.use(
  "/api",
  apiLimiter,
  contactRoutes
);


/* =========================
   404
========================= */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route introuvable.",
  });
});


/* =========================
   ERROR HANDLER
========================= */

app.use((error, req, res, next) => {
  console.error("Express error :", error);

  if (error.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      success: false,
      message:
        "Le CV est trop volumineux. Taille maximale : 5 Mo.",
    });
  }

  if (
    error.message?.includes(
      "Format de CV non autorisé"
    )
  ) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  return res.status(500).json({
    success: false,
    message: "Erreur interne du serveur.",
  });
});


export default app;