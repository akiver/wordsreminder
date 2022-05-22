export function isStringEmpty(value?: string) {
  return value == null || !/\S/.test(value);
}
