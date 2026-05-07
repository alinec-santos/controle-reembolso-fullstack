import { AxiosError } from "axios"

type ApiErrorResponse = {
  message?: string
}

export function getApiErrorMessage(error: unknown, fallback: string) {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiErrorResponse | undefined

    return data?.message ?? fallback
  }

  return fallback
}