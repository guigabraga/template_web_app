import { spawn } from "node:child_process";

const executable = (command) => (process.platform === "win32" ? `${command}.cmd` : command);
const commands = [
  ["prisma", ["generate", "--watch"]],
  ["tsc", ["-p", "tsconfig.json", "--watch", "--preserveWatchOutput"]],
];
const processes = commands.map(([command, args]) =>
  spawn(executable(command), args, {
    env: process.env,
    stdio: "inherit",
  }),
);
let stopping = false;

const stop = (signal) => {
  if (stopping) {
    return;
  }

  stopping = true;

  for (const process of processes) {
    process.kill(signal);
  }
};

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.once(signal, () => {
    stop(signal);
  });
}

for (const child of processes) {
  child.once("error", (error) => {
    console.error(error);
    process.exitCode = 1;
    stop("SIGTERM");
  });

  child.once("exit", (code, signal) => {
    if (stopping) {
      return;
    }

    process.exitCode = signal ? 1 : (code ?? 1);
    stop("SIGTERM");
  });
}
