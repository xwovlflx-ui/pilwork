import { generateKeyPairSync } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const keyDirectory = resolve("apps/api/keys");
mkdirSync(keyDirectory, { recursive: true });

const { privateKey, publicKey } = generateKeyPairSync("rsa", {
  modulusLength: 3072,
  publicKeyEncoding: { type: "spki", format: "pem" },
  privateKeyEncoding: { type: "pkcs8", format: "pem" },
});

writeFileSync(resolve(keyDirectory, "dev-private.pem"), privateKey, { mode: 0o600 });
writeFileSync(resolve(keyDirectory, "dev-public.pem"), publicKey);
console.info(`Generated development JWT keys in ${keyDirectory}`);

