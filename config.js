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

export const secret = "Kdi9a-28@u_-m2*@*u-ep(*-M,MJK-DA8D-LP(a@-*#&*^-%&%$&-)*(@-qjsa*"