export type DatePickerModelValue = Date | Date[] | (Date | null)[] | null | undefined

export const parseDatePickerValue = (date: string | undefined) => {
  if (!date) return null

  const [year, month, day] = date.split('-').map(Number)

  return Number.isFinite(year) && Number.isFinite(month) && Number.isFinite(day) ? new Date(year, month - 1, day) : null
}

export const formatDatePickerValue = (date: DatePickerModelValue) => {
  if (!(date instanceof Date)) return ''

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}
