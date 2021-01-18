import session from "express-session";
import mongodb_session_store from "connect-mongodb-session";

/**
 * @typedef {Object} SessionMiddlewareOptions
 * @property {string} secret Секретный ключ
 * @property {string} uri MongoDB uri
 * @property {number} maxAge Время жизни Cookie
 */

/**
 * Session with store in MongoDB
 * @param {SessionMiddlewareOptions} options
 */
export default function (options) {
  const MongoDBStore = mongodb_session_store(session);
  const store = new MongoDBStore({
    uri: options.uri,
    collection: "client_sessions",
  });

  return session({
    secret: options.secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
      signed: true,
      maxAge: options.maxAge ?? 7 * 24 * 60 * 60 * 1000, // 7 days
    },
    store: store,
  });
}
