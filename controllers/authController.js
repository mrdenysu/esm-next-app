import { error } from "../util/logger.js";

class AuthController {
  /**
   * Запросить код авктивации
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  async get_validate_code(req, res) {
    try {
      res.json({ message: 0 });
    } catch (e) {
      error(e);
      res.status(500).json({ message: 1 });
    }
  }

  /**
   * Авторизация
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  async login(req, res) {
    try {
      res.json({ message: 0 });
    } catch (e) {
      error(e);
      res.status(500).json({ message: 1 });
    }
  }

  /**
   * Регистрация
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  async registration(req, res) {
    try {
      res.json("1");
    } catch (e) {
      error(e);
      res.status(500).json({ message: 0 });
    }
  }
}

export default new AuthController();
