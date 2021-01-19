// Main
import { Controller } from "./Controller.js";

// Models
import Role from "../models/Role.js";
import User from "../models/User.js";

// Utils
import { hash, compare } from "bcrypt";
import { generateAccessToken, generateEmailToken, verifyToken } from "../util/jwt.js";
import sendMail from "../util/sendMail.js";

class AuthController extends Controller {
  /**
   * Запросить код авктивации
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  async get_validate_code(req, res) {
    try {
      if (this.__body_valid(req, res) == false) return;
      const { email } = req.body;
      let condidate = await User.findOne({ email: email });
      if (condidate) {
        return this.__error(res, "Пользователь с таким e-mail существует", req.body);
      } else {
        let emailToken = generateEmailToken(email);
        await sendMail(email, {
          subject: "Код подтвержения регистрации",
          html: `<p>Code: <b>${emailToken}</b></p>`,
        });
        return this.__success(res, "Код для подтверждения регистрации отправлен на e-mail");
      }
    } catch (e) {
      this.__error(res, "Error in `get_validate_code`", {}, e);
    }
  }

  /**
   * Авторизация
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  async login(req, res) {
    try {
      if (this.__body_valid(req, res) == false) return;
      const { email, password } = req.body;
      let condidate = await User.findOne({ email: email });
      if (condidate) {
        if (!(await compare(password, condidate.password))) {
          return this.__error(res, "Не верный пароль", req.body);
        }
        req.session.token = generateAccessToken(condidate._id);
        return this.__success(res, "Авторизация прошла успешно");
      } else {
        return this.__error(res, "Пользователь с таким e-mail не существует", req.body);
      }
    } catch (e) {
      return this.__error(res, "Error in `login`", {}, e);
    }
  }

  /**
   * Регистрация
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  async registration(req, res) {
    try {
      if (this.__body_valid(req, res) == false) return;
      const { email, password, code } = req.body;
      let verify = await verifyToken(code);
      let condidate = await User.findOne({ email: email });

      if (verify && verify.email == email) {
        if (condidate) {
          return this.__error(res, "Пользователь с таким e-mail уже существует", req.body);
        } else {
          const newUser = new User({
            email: email,
            password: await hash(password, 7),
            roles: [(await Role.findOne({ value: "USER" }))._id],
          });
          newUser.save();
          req.session.token = generateAccessToken(newUser._id);
          return this.__success(res, "Регистрация прошла успешно");
        }
      } else {
        return this.__error(res, "Неверный код подтверждения", req.body);
      }
    } catch (e) {
      return this.__error(res, "Error in `registration`", {}, e);
    }
  }

  async exit(req, res) {
    try {
      if (req?.user !== null) {
        delete req.session.token;
        return this.__success(res, "Вы успешно де-авторизировались");
      } else {
        if (req.session?.token) {
          delete req.session.token;
          return this.__success(res, "Вы успешно де-авторизировались", {
            token: "not valid",
          });
        }
        return this.__error(res, "Пользователь не авторизован");
      }
    } catch (e) {
      return this.__error(res, "Error in `exit`", {}, e);
    }
  }
}

export default new AuthController();
