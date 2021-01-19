import User from "../models/User.js";
import { Controller } from "../controllers/Controller.js";
import { verifyToken } from "../util/jwt.js";

/**
 * authMiddlevare
 * @param {import("express").Request} req Request
 * @param {import("express").Response} res Response
 * @param {import("express").NextFunction} next NextFunction
 */
export default async function (req, res, next) {
  const controller = new Controller();
  try {
    if (req.session?.token === undefined) {
      req.user = null;
    } else {
      const verify = await verifyToken(req.session.token);
      
      if (verify) {
        const condidate = await User.findById(verify.id).populate("roles");
        if (!condidate) {
          delete req.session.token;
          req.user = null;
        } else {
          req.user = condidate;
        }
      }
    }
    return next();
  } catch (e) {
    return controller.__error(res, "Error: `authMiddlevare`", {}, e);
  }
}
