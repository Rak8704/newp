
import { createHash, timingSafeEqual } from "node:crypto";
import { GSC_SECRET_KEY, GSC_OPERATOR_CODE } from "./config";

export function md5(value: string): string {
  return createHash("md5")
    .update(value, "utf8")
    .digest("hex");
}

export function gscOperatorSign(
  requestTime: string | number,
  action: string,
  operatorCode: string,
): string {
  if (!GSC_SECRET_KEY) {
    throw new Error("GSC_SECRET_KEY is missing");
  }

  if (!operatorCode) {
    throw new Error("GSC_OPERATOR_CODE is missing");
  }

  const signString =
    `${requestTime}${GSC_SECRET_KEY}${action}${operatorCode}`;

  return md5(signString);
}

export function gscSign(
  requestTime: string | number,
  action: string,
  operatorCode: string,
): string {
  return gscOperatorSign(requestTime, action, operatorCode);
}

export function gscLaunchSign(requestTime: number): string {
  return gscOperatorSign(
    requestTime,
    "launchgame",
    GSC_OPERATOR_CODE,
  );
}

export function verifySignature(
  expected: string,
  provided: string | undefined | null,
): boolean {
  if (!provided) return false;

  const a = Buffer.from(expected.toLowerCase(), "utf8");
  const b = Buffer.from(provided.toLowerCase(), "utf8");

  return a.length === b.length && timingSafeEqual(a, b);
}
