import express from "express";
import compression from "compression";
import favicon from "serve-favicon";

import { join } from "path";

/**
 * Static files
 * @param {import("express").Application} app
 * @param {string} public_dir
 */
export default function (app, public_dir) {
  const icon = join(public_dir, "favicon.ico");

  app.use(compression());
  app.use(favicon(icon));
  app.use("/public", express.static(public_dir));
}
