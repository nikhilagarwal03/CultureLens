import { clientEnv } from "./env";

export class ApiClientError extends Error {
  status: number;
  code: string;
  requestId?: string;

  constructor(message: string, status: number, code: string, requestId?: string) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.code = code;
    this.requestId = requestId;
  }
}

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type RequestOptions = {
  method?: HttpMethod;
  body?: unknown;
  signal?: AbortSignal;
};

type ApiEnvelope<T> = {
  ok: boolean;
  data: T;
  error?: {
    code?: string;
    message?: string;
    details?: unknown;
  };
  meta?: {
    requestId?: string;
  };
};

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, signal } = options;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  const response = await fetch(`${clientEnv.apiBaseUrl}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
    signal,
  });

  const json = (await response.json()) as ApiEnvelope<T>;

  if (!response.ok || !json.ok) {
    throw new ApiClientError(
      json?.error?.message || "Request failed",
      response.status,
      json?.error?.code || "REQUEST_FAILED",
      json?.meta?.requestId
    );
  }

  return json.data;
}

export const apiClient = {
  get: <T>(path: string, options?: Omit<RequestOptions, "method" | "body">) =>
    request<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, body?: unknown, options?: Omit<RequestOptions, "method" | "body">) =>
    request<T>(path, { ...options, method: "POST", body }),
  put: <T>(path: string, body?: unknown, options?: Omit<RequestOptions, "method" | "body">) =>
    request<T>(path, { ...options, method: "PUT", body }),
  patch: <T>(path: string, body?: unknown, options?: Omit<RequestOptions, "method" | "body">) =>
    request<T>(path, { ...options, method: "PATCH", body }),
  delete: <T>(path: string, options?: Omit<RequestOptions, "method" | "body">) =>
    request<T>(path, { ...options, method: "DELETE" }),
};
