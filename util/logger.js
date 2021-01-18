import c from "colors";

export function request(data) {
  console.log(c.bold(c.blue("▼ Request:")), data, c.bold(c.blue("⊙")));
}

export function log(...data) {
  console.log(c.bold(c.cyan("Log:")), ...data, c.bold(c.cyan("⊙")));
}

export function success(...data) {
  console.log(c.bold(c.green("✔ Success:")), ...data, c.bold(c.green("⊙")));
}

export function warn(...data) {
  console.log(c.bold(c.yellow("⚠ Warn:")), ...data, c.bold(c.yellow("⊙")));
}

export function error(...data) {
  console.log(c.bold(c.red("⚠ Error:")), ...data, c.bold(c.red("⊙")));
}

export function timeStart(label) {
  console.time(label);
}

export function timeEnd(label, ...data) {
  console.timeLog(label, ...data, "⏳");
}
