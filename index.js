/* Import */
import { PORT, db, secret } from "./config.js";
import ejs from "./util/express/ejs.js";
import serve from "./util/express/static-server.js";
import { error, success } from "./util/logger.js";

import { join, resolve } from "path";
import express from "express";
import mongoose from "mongoose";
import helmet from "helmet";

import session from "./middlewares/sessionMiddleware.js";
import authMiddleware from "./middlewares/authMiddleware.js";
import page404 from "./middlewares/404.js"

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
app.use(authMiddleware)

app.use("/", mainRouter);
app.use("/user", apiRouter);
app.use("/post", apiRouter);
app.use("/chat", apiRouter);
app.use("/clab", apiRouter);
app.use("/api", apiRouter);


app.use(page404);

/* Start */
try {
  await mongoose.connect(db.uri, db.options);
  app.listen(PORT, () => {
    success(`Server listen port: ${PORT}`);
  });
} catch (e) {
  error(e);
}
