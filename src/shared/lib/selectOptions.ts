export interface SelectOption<T = string> {
  label: string
  value: T
}

export const toSelectOptions = <T extends string>(
  values: readonly T[],
  getLabel: (value: T) => string,
): SelectOption<T>[] =>
  values.map((value) => ({
    label: getLabel(value),
    value,
  }))
