import jsonwebtoken from "jsonwebtoken";
import { secret } from "../config.js";

export function generateAccessToken(id) {
  const payload = {
    id,
  };
  return jsonwebtoken.sign(payload, secret, {
    expiresIn: "7d",
  });
}

export function generateEmailToken(email) {
  const payload = {
    email,
  };
  return jsonwebtoken.sign(payload, secret, {
    expiresIn: "15m",
  });
}

export async function verifyToken(token, fn) {
  return await new Promise((resolve) => {
    jsonwebtoken.verify(token, secret, (err, decoded) => {
      if (err) {
        resolve(false);
      } else {
        resolve(decoded);
      }
    });
  });
}
