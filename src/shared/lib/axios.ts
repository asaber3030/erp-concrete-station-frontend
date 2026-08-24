import { getCookie } from "@tanstack/react-start/server"
import { APP_CONFIG } from "../config/app"

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"

export type ApiResponse<T> = {
  message: string
  status: number
  data: T | null
}

const getToken = () => {
  const event = getCookie("_token")
  return event ?? null
}

const request = async <T>(method: HttpMethod, url: string, body?: any, headers?: Record<string, string>): Promise<ApiResponse<T>> => {
  try {
    const token = getToken()

    const res = await fetch(`${APP_CONFIG.apiUrl}${url}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    })

    const data = await res.json()

    return {
      message: data?.message || "Success",
      status: res.status,
      data: data?.data ?? data ?? null,
    }
  } catch (error) {
    return {
      message: "Network error or unexpected error",
      status: 500,
      data: null,
    }
  }
}

// helpers
export const getRequest = <T>(url: string, headers?: Record<string, string>) => request<T>("GET", url, undefined, headers)

export const postRequest = <T>(url: string, body: any, headers?: Record<string, string>) => request<T>("POST", url, body, headers)

export const putRequest = <T>(url: string, body: any, headers?: Record<string, string>) => request<T>("PUT", url, body, headers)

export const patchRequest = <T>(url: string, body: any, headers?: Record<string, string>) => request<T>("PATCH", url, body, headers)

export const deleteRequest = <T>(url: string, headers?: Record<string, string>) => request<T>("DELETE", url, undefined, headers)
