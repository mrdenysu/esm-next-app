import { validationResult } from "express-validator";
import { error, log } from "../util/logger.js";

export class Controller {
  /**
   * Validate body
   * @param {import("express").Request} req Request
   * @param {import("express").Response} res Response
   */
  __body_valid(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      this.__error(res, "Поля заполенны не верно", { errors: errors.array() })
      return false
    }
    return true
  }

  /**
   * Error res
   * @param {import("express").Response} res Response
   * @param {string} message Message
   * @param {*} data Data
   * @param {*} e Error
   */
  __error(res, message, data, e) {
    let status = 400
    if (e) {
      error(e);
      status = 500
    }

    let response = {
      type: "error",
      message,
      data,
    };

    return res.status(status).json(response)
  }

  /**
   * Success res
   * @param {import("express").Response} res Response
   * @param {string} message Message
   * @param {*} data Data
   */
  __success(res, message, data) {
    log(data);
    let response = {
      type: "success",
      message,
      data,
    };
    return res.status(200).json(response)
  }
}
