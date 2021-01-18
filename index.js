/* Import */
import { PORT, db, secret } from "./config.js";

import { join, resolve } from "path";
import express from "express";
import mongoose from "mongoose";
import helmet from "helmet";

import session from "./middlewares/sessionMiddleware.js";

import ejs from "./helpers/ejs.js";
import serve from "./helpers/static-server.js";
import { error, success } from "./helpers/logger.js";

/* App */
const app = express();

ejs(app);
app.use(helmet());
serve(app, join(resolve(), "views/public"));
app.use(
  session({
    secret: secret,
    uri: db.uri,
  })
);
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
