import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const KEY_LENGTH = 64;

export const parolaHashle = (parola: string) => {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(parola, salt, KEY_LENGTH).toString("hex");
  return `${salt}:${hash}`;
};

export const parolaDogrula = (parola: string, sakliHash: string) => {
  const [salt, hash] = sakliHash.split(":");

  if (!salt || !hash) {
    return false;
  }

  const hesaplananHash = scryptSync(parola, salt, KEY_LENGTH);
  const sakliHashBuffer = Buffer.from(hash, "hex");

  if (sakliHashBuffer.length !== hesaplananHash.length) {
    return false;
  }

  return timingSafeEqual(sakliHashBuffer, hesaplananHash);
};

