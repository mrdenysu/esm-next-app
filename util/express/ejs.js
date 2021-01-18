import ejs from "ejs";

/**
 * View engine activate
 * @param {import("express").Application} app
 */
export default function (app) {
  async function render(path, data, cb) {
    ejs.renderFile(
      path,
      data,
      {
        cache: false,
      },
      cb
    );
  }

  app.engine("ejs", render);
  app.set("view engine", "ejs");
}
