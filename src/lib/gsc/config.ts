
const env = (name: string, fallback = "") =>
  process.env[name] || fallback;

export const GSC_OPERATOR_CODE = env("GSC_OPERATOR_CODE");

export const GSC_SECRET_KEY = env("GSC_SECRET_KEY");

export const GSC_BASE_URL = env(
  "GSC_BASE_URL",
  "https://staging.gsimw.com",
).replace(/\/+$/, "");

export const GSC_CURRENCY = env("GSC_CURRENCY", "BDT");

export const GSC_LANGUAGE_CODE = env("GSC_LANGUAGE_CODE", "0");

export const GSC_CALLBACK_BASE_URL = env("GSC_CALLBACK_BASE_URL");

export const GSC_LOBBY_URL = env("GSC_LOBBY_URL");

export const GSC_CHANNEL_CODE = env("GSC_CHANNEL_CODE", "gscp");

export function assertGscConfig() {
  const missing: string[] = [];

  if (!GSC_OPERATOR_CODE) {
    missing.push("GSC_OPERATOR_CODE");
  }

  if (!GSC_SECRET_KEY) {
    missing.push("GSC_SECRET_KEY");
  }

  if (!GSC_BASE_URL) {
    missing.push("GSC_BASE_URL");
  }

  if (missing.length > 0) {
    throw new Error(
      `GSC+ configuration is incomplete: ${missing.join(", ")}`,
    );
  }
}
