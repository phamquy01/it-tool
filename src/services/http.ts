// src/services/http.ts

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface ApiResponse<T> {
  success: boolean;
  status: number;
  data?: T;
  error?: string;
}

async function request<T>(
  url: string,
  method: HttpMethod = 'GET',
  body?: unknown
): Promise<ApiResponse<T>> {
  try {
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);

    const data = (await response.json().catch(() => null)) as T | null;

    if (!response.ok) {
      return {
        success: false,
        status: response.status,
        error:
          data && typeof data === 'object' && 'message' in data
            ? (data as { message: string }).message
            : response.statusText,
      };
    }

    return {
      success: true,
      status: response.status,
      data: data as T,
    };
  } catch (error: unknown) {
    return {
      success: false,
      status: 0,
      error:
        typeof error === 'object' && error !== null && 'message' in error
          ? String((error as { message?: unknown }).message)
          : 'Network error',
    };
  }
}

const http = {
  get: <T>(url: string) => request<T>(url, 'GET'),
  post: <T>(url: string, body?: unknown) => request<T>(url, 'POST', body),
  put: <T>(url: string, body?: unknown) => request<T>(url, 'PUT', body),
  patch: <T>(url: string, body?: unknown) => request<T>(url, 'PATCH', body),
  delete: <T>(url: string) => request<T>(url, 'DELETE'),
};

export default http;
