/**
 * If route not faund
 * @param {import("express").Request} req Request
 * @param {import("express").Response} res Response
 * @param {import("express").NextFunction} next NextFunction
 */
export default function (req, res, next) {
  res.status(404).send("Sorry can't find that!");
}