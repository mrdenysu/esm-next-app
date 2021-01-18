/* Import */
import { PORT, db, secret } from "./config.js";

import { join, resolve } from "path";
import express from "express";
import mongoose from "mongoose";
import compression from "compression";
import helmet from "helmet";
import favicon from "serve-favicon";
import session from "./middlewares/sessionMiddleware.js"
import ejs from "./helpers/ejs.js"

import { error, success } from "./helpers/logger.js";

/* Option */
const __dirname = resolve();

/* App */
const app = express();

// View (render)
ejs(app)

// Security
app.use(helmet());

// Static files
app.use(compression());
app.use(favicon(join(__dirname, "views/public/favicon.ico")));
app.use("/public", express.static(join(__dirname, "views/public")));

// Session
app.use(session({
  secret: secret,
  uri: db.uri
}))

// Row as JSON string to res.body
app.use(express.json());

// Router

/* Start */
try {
  await mongoose.connect(db.uri, db.options);
  app.listen(PORT, () => {
    success(`Server listen port: ${PORT}`);
  });
} catch (e) {
  error(e);
}
