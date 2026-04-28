import { mockApiGet, mockApiPost, readMockApiBaseUrl } from "./mockApi";

type JsonValue = Record<string, unknown> | Array<unknown> | string | number | boolean | null;

export async function apiGet<T>(path: string, authToken?: string): Promise<T> {
  return mockApiGet<T>(path, authToken);
}

export async function apiPost<T>(path: string, body: JsonValue, authToken?: string): Promise<T> {
  return mockApiPost<T>(path, body, authToken);
}

export const readApiBaseUrl = readMockApiBaseUrl;