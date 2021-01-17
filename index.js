/* Import */
import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import mongodb_session_store from "connect-mongodb-session";
import compression from "compression";

import { join, resolve } from "path";

import { PORT, db, secret } from "./config.js";
import { error, success } from "./helpers/logger.js";

/* App */
const app = express();

// Security
app.disable("x-powered-by");

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
app.use(compression())
app.use("/public", express.static(join(resolve(), "views/public")))

// Row as JSON string to res.body
app.use(express.json())

// Router
app.get("/", (req, res) => {
  res.json({
    session: req.session,
    session_id: req.sessionID
  });
});

/* Start */
try {
  await mongoose.connect(db.uri, db.options);
  app.listen(PORT, () => {
    success(`Server listen port: ${PORT}`);
  });
} catch (e) {
  error(e);
}
