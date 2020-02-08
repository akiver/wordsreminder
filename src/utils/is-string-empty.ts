export const isStringEmpty = (value?: string) => {
  return value == null || !/\S/.test(value);
};
