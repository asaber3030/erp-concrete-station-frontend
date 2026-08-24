import axios, { AxiosError, type AxiosInstance, type AxiosRequestConfig } from "axios"
import { APP_CONFIG } from "../config/app"
import { getCookie } from "@tanstack/react-start/server"
import { AUTH_CONFIG } from "../config/app/auth"
import type { ApiResponse, PaginatedResponse, PaginationMeta } from "../types"

class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: APP_CONFIG.apiUrl,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    this.client.interceptors.request.use((config) => {
      const token = getCookie(AUTH_CONFIG.tokenCookieName)

      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }

      return config
    })

    this.client.interceptors.response.use(
      (res) => res,
      (error: AxiosError) => {
        return Promise.reject(this.normalizeError(error))
      },
    )
  }

  private normalizeError(error: AxiosError): ApiResponse<never> {
    const status = error.response?.status ?? 0
    const data: any = error.response?.data

    return {
      message: data?.message || error.message || "Unexpected error occurred",

      status,
      data: null,
      error: data?.errors || error.message,
    }
  }

  private normalizeResponse<T>(res: any): ApiResponse<T> {
    return {
      message: res?.data?.message ?? "Success",
      status: res.status,
      data: res?.data?.data ?? res?.data ?? null,
      error: null,
    }
  }

  async request<T>(config: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const res = await this.client.request(config)
    return this.normalizeResponse<T>(res)
  }

  get<T>(url: string, config?: AxiosRequestConfig) {
    return this.request<T>({ ...config, method: "GET", url })
  }

  post<T>(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.request<T>({ ...config, method: "POST", url, data })
  }

  put<T>(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.request<T>({ ...config, method: "PUT", url, data })
  }

  patch<T>(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.request<T>({ ...config, method: "PATCH", url, data })
  }

  delete<T>(url: string, config?: AxiosRequestConfig) {
    return this.request<T>({ ...config, method: "DELETE", url })
  }
}

export const api = new ApiClient()

type RequestOptions = {
  token?: string
}

export function toPaginated<T>(payload: any): PaginatedResponse<T> {
  const fallbackMeta: PaginationMeta = { total: 0, page: 1, per_page: 15, last_page: 1 }

  if (!payload) {
    return { data: [], meta: fallbackMeta }
  }

  if (Array.isArray(payload.data) && payload.meta) {
    return {
      data: payload.data,
      meta: {
        total: Number(payload.meta.total ?? payload.data.length),
        page: Number(payload.meta.page ?? 1),
        per_page: Number(payload.meta.per_page ?? 15),
        last_page: Number(payload.meta.last_page ?? 1),
      },
    }
  }

  if (Array.isArray(payload)) {
    return {
      data: payload,
      meta: { total: payload.length, page: 1, per_page: payload.length || 15, last_page: 1 },
    }
  }

  if (Array.isArray(payload.data)) {
    return {
      data: payload.data,
      meta: { total: payload.data.length, page: 1, per_page: payload.data.length || 15, last_page: 1 },
    }
  }

  return { data: [], meta: fallbackMeta }
}

export function toList<T>(payload: T[] | { data?: T[] | null } | PaginatedResponse<T> | null | undefined): T[] {
  if (!payload) return []
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload.data)) return payload.data
  return []
}

export async function apiFetch<T>(path: string, options: RequestOptions = {}, query?: Record<string, unknown>): Promise<T> {
  const url = new URL(path, APP_CONFIG.apiUrl)

  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value))
    }
  })

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
    },
  })

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`)
  }

  const payload = await response.json()
  return (payload?.data ?? payload) as T
}
