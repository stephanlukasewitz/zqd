// Erzeugt den Wert für ADMIN_PASSWORD_HASH. Aufruf: pnpm --filter admin passwort
import { randomBytes, scryptSync } from "node:crypto";
import { createInterface } from "node:readline";

const rl = createInterface({ input: process.stdin, output: process.stdout });
rl.question("Passwort: ", (pw) => {
  rl.close();
  if (!pw || pw.length < 10) {
    console.error("Bitte mindestens 10 Zeichen verwenden.");
    process.exit(1);
  }
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(pw, salt, 64).toString("hex");
  console.log("\nADMIN_PASSWORD_HASH=" + `scrypt:${salt}:${hash}`);
});
