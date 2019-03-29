export const isStringEmpty = (value?: string) =>
  value == null || !/\S/.test(value)
