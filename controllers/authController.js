import { error } from "../util/logger.js";
import Role from "../models/Role.js";
import User from "../models/User.js";
import { hash, compare } from "bcrypt";
import { generateAccessToken, generateEmailToken, verifyToken } from "../util/jwt.js";
import sendMail from "../util/sendMail.js";

class AuthController {
  /**
   * Запросить код авктивации
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  async get_validate_code(req, res) {
    try {
      const { email } = req.body;
      let condidate = await User.findOne({ email: email });
      if (condidate) {
        return res.json({
          type: "error",
          message: "Пользователь с таким e-mail существует",
          data: req.body,
        });
      } else {
        let emailToken = generateEmailToken(email);
        await sendMail(email, {
          subject: "Код подтвержения регистрации",
          html: `<p>Code: <b>${emailToken}</b></p>`,
        });
        return res.json({
          type: "success",
          message: "Код для подтверждения регистрации отправлен на e-mail",
        });
      }
    } catch (e) {
      error(e);
      return res.status(500).json({
        type: "error",
        message: "Error in `get_validate_code`",
      });
    }
  }

  /**
   * Авторизация
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  async login(req, res) {
    try {
      const { email, password } = req.body;

      let condidate = await User.findOne({ email: email });
      if (condidate) {
        if (!(await compare(password, condidate.password))) {
          return res.json({
            type: "error",
            message: "Не верный пароль",
            data: req.body,
          });
        }

        req.session.token = generateAccessToken(condidate._id);
        return res.json({
          type: "success",
          message: "Авторизация прошла успешно",
        });
      } else {
        return res.json({
          type: "error",
          message: "Пользователь с таким e-mail не существует",
          data: req.body,
        });
      }
    } catch (e) {
      error(e);
      return res.status(500).json({
        type: "error",
        message: "Error in `login`",
      });
    }
  }

  /**
   * Регистрация
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  async registration(req, res) {
    try {
      const { email, password, code } = req.body;

      let verify = await verifyToken(code);
      let condidate = await User.findOne({ email: email });

      if (verify && verify.email == email) {
        if (condidate) {
          return res.json({
            type: "error",
            message: "Пользователь с таким e-mail уже существует",
            data: req.body,
          });
        } else {
          let user = new User({
            email: email,
            password: await hash(password, 7),
            roles: [(await Role.findOne({ value: "USER" }))._id],
          });
          user.save();

          req.session.token = generateAccessToken(user._id);
          return res.json({
            type: "success",
            message: "Регистрация прошла успешно",
          });
        }
      } else {
        return res.json({
          type: "error",
          message: "Неверный код подтверждения",
          data: req.body,
        });
      }
    } catch (e) {
      error(e);
      return res.status(500).json({
        type: "error",
        message: "Error in `registration`",
      });
    }
  }

  async exit(req, res) {
    try {
      if (req?.user) {
        delete req.session.token;
        return res.json({
          type: "success",
          message: "Вы успешно де-авторизировались",
        });
      } else {
        if (req.session?.token) {
          delete req.session.token;
          return res.json({
            type: "success",
            message: "Вы успешно де-авторизировались",
            data: {
              user: "Not find",
            },
          });
        }

        return res.json({
          type: "error",
          message: "Пользователь не авторизован",
        });
      }
    } catch (e) {
      error(e);
      return res.status(500).json({
        type: "error",
        message: "Error in `exit`",
      });
    }
  }
}

export default new AuthController();
