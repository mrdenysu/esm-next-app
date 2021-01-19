import { Controller } from "../controllers/Controller.js";
import { log } from "../util/logger.js";

/**
 * Доступ к страницы по ролям
 * @param {Array} roles Array of role_value
 */
export default function (roles) {
  const controller = new Controller();

  /**
   * roleMiddlevare
   * @param {import("express").Request} req Request
   * @param {import("express").Response} res Response
   * @param {import("express").NextFunction} next NextFunction
   */
  function _middleware(req, res, next) {
    if (req.method === "OPTIONS") {
      next();
    } else {
      try {
        let hasRole = false;
        if (roles.length == 0) {
          hasRole = req.user === null;
        } else {
          if (req.user === null) {
            return controller.__error(res, "Пользователь не авторизован");
          }
          const userRoles = [];
          req.user.roles.forEach((el) => {
            userRoles.push(el.value);
          });
          roles.forEach((role) => {
            if (userRoles.includes(role)) {
              hasRole = true;
            }
          });
          if (!hasRole) {
            return res.redirect("/");
          }
        }
        if (hasRole) {
          next();
        } else {
          return controller.__error(res, "Доступ ограничен");
        }
      } catch (e) {
        return controller.__error(res, "Error: `roleMiddlevare`", {}, e);
      }
    }
  }

  return _middleware;
}
