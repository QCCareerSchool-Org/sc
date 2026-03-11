export const capitalizeFirstLetter = ([ first, ...rest ]: string, locale = navigator.language): string => {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  return first === undefined ? '' : first.toLocaleUpperCase(locale) + rest.join('');
};
