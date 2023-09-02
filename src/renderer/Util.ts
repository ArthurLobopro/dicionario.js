import { languageNames } from "../lib/languageNames"
import { ReactMouseEvent } from "./types"

export function formatDate(datestring: string) {
  const pad2 = (n: any) => String(n).padStart(2, "0")

  const date = new Date(datestring)

  const year = date.getFullYear()
  const month = pad2(date.getMonth() + 1)
  const day = pad2(date.getDate())

  const hours = pad2(date.getHours())
  const minutes = pad2(date.getMinutes())

  return `${day}/${month}/${year} ${hours}:${minutes}`
}

export function hoverFocus(
  event: ReactMouseEvent<HTMLButtonElement | HTMLSelectElement>,
) {
  event.currentTarget.focus()
  event.stopPropagation()
  event.preventDefault()
}

export type keyofLangs = keyof typeof languageNames

export function getLangName(lang: string) {
  return languageNames[lang as keyofLangs] || lang
}
