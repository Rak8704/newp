
import {
  GSC_BASE_URL,
  GSC_OPERATOR_CODE,
  assertGscConfig,
} from "./config";
import { gscOperatorSign } from "./signature";

type GscRequestOptions = {
  method?: "GET" | "POST";
  body?: Record<string, unknown>;
  query?: Record<string, string | number | undefined>;
  action: string;
  requestTime?: number;
};

export async function gscRequest<T>(
  path: string,
  options: GscRequestOptions,
): Promise<T> {
  assertGscConfig();

  const requestTime =
    options.requestTime ?? Math.floor(Date.now() / 1000);

  const method = options.method ?? "GET";
  const sign = gscOperatorSign(
    requestTime,
    options.action,
    GSC_OPERATOR_CODE,
  );

  const url = new URL(
    `${GSC_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`,
  );

  const authFields = {
    operator_code: GSC_OPERATOR_CODE,
    request_time: String(requestTime),
    sign,
  };

  let requestBody: string | undefined;

  if (method === "GET") {
    for (const [key, value] of Object.entries({
      ...options.query,
      ...authFields,
    })) {
      if (value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    }
  } else {
    requestBody = JSON.stringify({
      ...(options.body ?? {}),
      ...authFields,
    });
  }

  const response = await fetch(url.toString(), {
    method,
    headers: { "Content-Type": "application/json" },
    body: requestBody,
    cache: "no-store",
  });

  const responseText = await response.text();

  let data: unknown;

  try {
    data = JSON.parse(responseText);
  } catch {
    throw new Error(
      `GSC+ returned non-JSON response (HTTP ${response.status}): ` +
        responseText.slice(0, 300),
    );
  }

  if (!response.ok) {
    throw new Error(
      `GSC+ HTTP ${response.status}: ${JSON.stringify(data)}`,
    );
  }

  return data as T;
}

export function gscLaunchSign(requestTime: number): string {
  return gscOperatorSign(
    requestTime,
    "launchgame",
    GSC_OPERATOR_CODE,
  );
}
