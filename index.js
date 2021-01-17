/* Import */
import express from "express";
import mongoose from "mongoose";
import ejs from "ejs";
import session from "express-session";
import mongodb_session_store from "connect-mongodb-session";
import compression from "compression";
import minify from "express-minify";
import helmet from "helmet";
import favicon from "serve-favicon";

import { join, resolve } from "path";

import { PORT, db, secret } from "./config.js";
import { error, success } from "./helpers/logger.js";

/* Option */
const __dirname = resolve();

/* App */
const app = express();

// View (render)
app.engine('ejs', async (path, data, cb) => {
  ejs.renderFile(`${path}`, data, {
    cache: false
  }, cb);
});
app.set('view engine', 'ejs');

// Security
app.use(helmet());

// Session
const MongoDBStore = mongodb_session_store(session);
const store = new MongoDBStore({
  uri: db.uri,
  collection: "client_sessions",
});
app.use(
  session({
    secret: secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
      signed: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    },
    store: store,
  })
);

// Static files
app.use(compression());
app.use(minify());
app.use(favicon(join(__dirname, "views/public/favicon.ico")));
app.use("/public", express.static(join(__dirname, "views/public")));

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
