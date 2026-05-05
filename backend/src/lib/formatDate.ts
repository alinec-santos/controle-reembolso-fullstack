import dayjs from "dayjs"
import "dayjs/locale/pt-br"

dayjs.locale("pt-br")

export const formatDate = (date: Date | string): string =>
  dayjs(date).format("DD/MM/YYYY")

export const formatDateTime = (date: Date | string): string =>
  dayjs(date).format("DD/MM/YYYY HH:mm")

export const parseDate = (date: string): Date =>
  dayjs(date).toDate()