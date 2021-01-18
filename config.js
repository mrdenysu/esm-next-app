import { env } from "process";

export const PORT = env.PORT ?? 8080;

export const db = {
  uri: "mongodb://localhost:27017/dev",
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  },
};

export const email = {
  service: "gmail",
  auth: {
    user: "mrdenysu@gmail.com",
    pass: "jfdqajvtlcuvkafb",
  },
};

export const secret = "(Di9a-28@u_-m2*@*)";
