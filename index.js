/* Import */
import { PORT, db, secret } from "./config.js";
import session from "./middlewares/sessionMiddleware.js";
import ejs from "./util/express/ejs.js";
import serve from "./util/express/static-server.js";
import { error, success } from "./util/logger.js";

import { join, resolve } from "path";
import express from "express";
import mongoose from "mongoose";
import helmet from "helmet";

import apiRouter from "./routes/apiRouter.js";
import mainRouter from "./routes/mainRouter.js";

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
app.use("/", mainRouter);
app.use("/api", apiRouter);

app.use(function (req, res, next) {
  res.status(404).send("Sorry can't find that!");
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
